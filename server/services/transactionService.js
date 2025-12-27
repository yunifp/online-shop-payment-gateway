// server/services/transactionService.js
const {
  sequelize,
  User,
  Carts,
  Address,
  Products_Variant,
  Products,
  Transaction,
  TransactionDetail,
} = require("../models");
const MidtransService = require("./midtransService");
const midtransService = new MidtransService();
const whatsappService = require("./whatsappService");
// const rajaOngkirService = require("./rajaOngkirService"); // Tidak butuh lagi untuk booking


class TransactionService {
  _generateOrderId() {
    return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  async getAllTransactions(queryParams) {
    try {
      const { page = 1, limit = 10, status, search } = queryParams;
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereCondition = {};

      // 1. Filter by Status (jika ada)
      if (status) {
        whereCondition.status = status;
      }

      // 2. Search by Order ID (jika ada)
      if (search) {
        whereCondition.order_id_display = { [Op.like]: `%${search}%` };
      }

      // 3. Query Database
      const { count, rows } = await Transaction.findAndCountAll({
        where: whereCondition,
        include: [
          { 
            model: User, 
            as: "user", 
            attributes: ["id", "name", "email", "phone_number"] // Ambil data user penting saja
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]], // Urutkan dari yang terbaru
      });

      // 4. Return Format Pagination
      return {
        total_data: count,
        total_page: Math.ceil(count / parseInt(limit)),
        current_page: parseInt(page),
        data: rows
      };

    } catch (error) {
      throw new Error(`Gagal mengambil data transaksi: ${error.message}`);
    }
  }
  async createTransaction(userId, checkoutData) {
    const {
      voucher_code,
      shipping_code, // e.g. "wahana"
      shipping_service, // e.g. "Express"
      shipping_cost, // e.g. 15000
    } = checkoutData;

    const t = await sequelize.transaction();
    try {
      // A. Ambil Data User & Keranjang
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Carts,
            as: "cart_items",
            include: [
              {
                model: Products_Variant,
                as: "variant",
                include: [{ model: Products, as: "product" }],
              },
            ],
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!user.cart_items || user.cart_items.length === 0) {
        throw new Error("Keranjang Anda kosong.");
      }

      // B. Validasi Stok & Hitung Harga
      const validItems = [];
      let subtotal_items = 0;

      for (const item of user.cart_items) {
        const variant = item.variant;
        if (!variant) continue;

        const lockedVariant = await Products_Variant.findByPk(variant.id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!lockedVariant) continue;
        if (lockedVariant.stock < item.quantity) {
          throw new Error(`Stok ${variant.product.name} habis.`);
        }

        validItems.push(item);
        subtotal_items += item.quantity * variant.price;
      }

      if (validItems.length === 0) throw new Error("Tidak ada item valid.");

      // C. Ambil Alamat User
      const address = await Address.findOne({ where: { user_id: userId } });
      if (!address) throw new Error("Alamat pengiriman tidak ditemukan.");
      const shippingAddressSnapshot = JSON.stringify(address);

      // D. Kalkulasi Biaya
      const parsedShippingCost = parseFloat(shipping_cost) || 0;
      const parsedServiceFee = 0; // Manual, jadi tidak ada fee sistem otomatis
      const discountAmount = 0;

      const grandTotalValue =
        subtotal_items + parsedShippingCost + parsedServiceFee - discountAmount;

      // E. Simpan Transaksi ke DB
      const orderId = this._generateOrderId();

      const newTransaction = await Transaction.create(
        {
          order_id_display: orderId,
          user_id: userId,

          total_price: subtotal_items,
          shipping_cost: parsedShippingCost,
          service_fee: parsedServiceFee,
          discount_amount: discountAmount,
          grand_total: grandTotalValue,

          shipping_address: shippingAddressSnapshot,

          courier: shipping_code,
          shipping_service: shipping_service,
          shipping_code: shipping_code,

          status: "pending",
          payment_method: "BANK TRANSFER",
          midtrans_token: "PENDING",
        },
        { transaction: t }
      );

      // F. Simpan Detail Item & Kurangi Stok
      for (const item of validItems) {
        const variant = item.variant;

        await TransactionDetail.create(
          {
            transaction_id: newTransaction.id,
            variant_id: variant.id,
            quantity: item.quantity,
            price_at_purchase: variant.price,
            weight_at_purchase_grams: variant.product.weight_grams,
            product_snapshot: JSON.stringify(variant),
          },
          { transaction: t }
        );

        await Products_Variant.decrement("stock", {
          by: item.quantity,
          where: { id: variant.id },
          transaction: t,
        });
      }

      await Carts.destroy({ where: { user_id: userId }, transaction: t });

      // G. Integrasi Midtrans (Dummy)
      const midtransParams = {
        transaction_details: {
          order_id: orderId,
          gross_amount: Math.round(grandTotalValue), // Midtrans menolak desimal
        },
        customer_details: {
          first_name: user.name,
          email: user.email,
          phone: user.phone_number,
        },
        item_details: [
          // Opsional: Bisa dikosongkan jika ribet, tapi bagus kalau ada
          {
            id: "TRX-TOTAL",
            price: Math.round(grandTotalValue),
            quantity: 1,
            name: "Total Pembayaran Order",
          },
        ],
      };

      // Minta Link ke Midtrans
      const midtransResponse = await midtransService.createTransaction(
        midtransParams
      );

      // Simpan Token ke DB
      await newTransaction.update(
        { midtrans_token: midtransResponse.token },
        { transaction: t }
      );

      await t.commit();

      return {
        transaction: newTransaction,
        redirect_url: midtransResponse.redirect_url,
        message: "Transaksi berhasil dibuat",
      };
    } catch (error) {
      await t.rollback();
      throw new Error(`Checkout Gagal: ${error.message}`);
    }
  }
  async handleMidtransNotification(notificationBody) {
    try {
      const statusResponse =
        await midtransService.snap.transaction.notification(notificationBody);

      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      console.log(`Midtrans Notif: ${orderId} => ${transactionStatus}`);

      // Cari Transaksi di DB
      const transaction = await Transaction.findOne({
        where: { order_id_display: orderId },
        include: [{ model: User, as: "user" }],
      });

      if (!transaction) throw new Error("Transaksi tidak ditemukan");

      // Logika Update Status
      let newStatus = transaction.status;

      if (transactionStatus == "capture") {
        if (fraudStatus == "challenge") {
          newStatus = "pending"; // Tahan dulu
        } else if (fraudStatus == "accept") {
          newStatus = "paid"; // Sukses Kartu Kredit
        }
      } else if (transactionStatus == "settlement") {
        newStatus = "paid"; // Sukses Bank Transfer
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "deny" ||
        transactionStatus == "expire"
      ) {
        newStatus = "cancelled"; // Gagal
      }

      // Update DB jika status berubah
      if (newStatus !== transaction.status) {
        await transaction.update({ status: newStatus });

        // Kirim WA jika sukses bayar
        if (newStatus === "paid") {
          const msg = `Halo Kak, pembayaran untuk order *${orderId}* telah kami terima! ✅\nKami akan segera memproses pengiriman.`;
          await whatsappService.sendMessage(transaction.user.phone_number, msg);
        }
      }

      return { status: "OK" };
    } catch (error) {
      console.error("Midtrans Notification Error:", error.message);
      throw new Error(error.message);
    }
  }
  // =================================================================
  // 2. UPDATE STATUS (ADMIN) - MANUAL INPUT RESI ONLY
  // =================================================================
  async updateTransactionStatus(transactionId, newStatus, manualReceiptNumber) {
    const t = await sequelize.transaction();
    try {
      // A. Ambil Data Transaksi
      const transaction = await Transaction.findByPk(transactionId, {
        include: [{ model: User, as: "user" }],
        transaction: t,
      });

      if (!transaction) throw new Error("Transaksi tidak ditemukan.");

      const updateData = { status: newStatus };

      // B. LOGIKA RESI MANUAL
      // Jika admin mengirimkan resi manual (lewat body request), kita simpan.
      // Tidak ada lagi panggilan ke rajaOngkirService.
      if (newStatus === "shipped") {
        if (!manualReceiptNumber || manualReceiptNumber.trim() === "") {
          throw new Error(
            "Gagal Update: Nomor Resi WAJIB DIISI untuk status 'shipped'!"
          );
        }
        updateData.shipping_receipt_number = manualReceiptNumber;
      } else if (manualReceiptNumber) {
        // Jika status bukan shipped tapi admin iseng isi resi (misal salah klik), simpan saja
        updateData.shipping_receipt_number = manualReceiptNumber;
      }

      // C. Update Database
      await transaction.update(updateData, { transaction: t });
      await t.commit();

      // D. Notifikasi WA (Tetap jalan menggunakan resi manual)
      this._sendNotification(transaction, newStatus, manualReceiptNumber);

      return transaction;
    } catch (error) {
      await t.rollback();
      throw new Error(`Update Status Gagal: ${error.message}`);
    }
  }

  // Helper Notifikasi
  async _sendNotification(transaction, newStatus, receiptNumber) {
    try {
      const userPhone = transaction.user?.phone_number;

      if (newStatus === "shipped" && receiptNumber && userPhone) {
        const message =
          `Halo Kak ${transaction.user.name || "Pelanggan"},\n\n` +
          `Pesanan Anda *${transaction.order_id_display}* telah dikirim secara manual! 🚚\n` +
          `Ekspedisi: ${(transaction.courier || "JNE").toUpperCase()}\n` +
          `No. Resi: *${receiptNumber}*\n\n` +
          `Terima kasih telah berbelanja di Toko Panjat Tebing!`;

        await whatsappService.sendMessage(userPhone, message);
      }
    } catch (err) {
      console.warn("Gagal kirim notifikasi WA:", err.message);
    }
  }
  async repayTransaction(transactionId) {
    const t = await sequelize.transaction();
    try {
      // 1. Ambil Data Transaksi
      const transaction = await Transaction.findByPk(transactionId, {
        include: [{ model: User, as: "user" }],
        transaction: t,
      });

      if (!transaction) throw new Error("Transaksi tidak ditemukan.");
      if (transaction.status === "paid")
        throw new Error("Transaksi sudah dibayar.");
      if (transaction.status === "cancelled")
        throw new Error("Transaksi sudah dibatalkan, silakan order ulang.");

      // 2. Cek Batas Waktu Absolut (48 Jam dari Checkout Awal)
      // Jika sudah lebih dari 2 hari, tolak request token baru.
      const timeLimit = new Date(transaction.createdAt);
      timeLimit.setHours(timeLimit.getHours() + 48); // Tambah 48 Jam

      if (new Date() > timeLimit) {
        throw new Error(
          "Waktu pembayaran telah habis total. Pesanan otomatis dibatalkan."
        );
        // Di sini nanti Cron Job yang akan membereskan statusnya jadi 'cancelled'
      }

      // 3. Buat Order ID Unik untuk Midtrans (TRX-123-retry1)
      // Kita pakai timestamp agar unik setiap kali klik "Bayar Lagi"
      const suffix = `-${Date.now()}`;
      const midtransOrderId = transaction.order_id_display + suffix;

      // 4. Siapkan Parameter Midtrans Baru
      const midtransParams = {
        transaction_details: {
          order_id: midtransOrderId, // ID dengan buntut baru
          gross_amount: Math.round(transaction.grand_total),
        },
        customer_details: {
          first_name: transaction.user.name,
          email: transaction.user.email,
          phone: transaction.user.phone_number,
        },
        expiry: {
          unit: "minutes",
          duration: 1440, // Token baru valid 24 jam lagi (atau sesuaikan sisa waktu)
        },
      };

      // 5. Minta Token ke Midtrans
      const midtransResponse = await midtransService.createTransaction(
        midtransParams
      );

      // 6. Update Token Baru di Database
      await transaction.update(
        {
          midtrans_token: midtransResponse.token,
        },
        { transaction: t }
      );

      await t.commit();

      return {
        redirect_url: midtransResponse.redirect_url,
        token: midtransResponse.token,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error.message);
    }
  }
}

module.exports = new TransactionService();
