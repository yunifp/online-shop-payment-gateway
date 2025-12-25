// server/services/transactionService.js
const {
  sequelize,
  User,
  Carts,
  Address,
  Products_Variant, // <-- NAMA MODEL YANG BENAR
  Voucher,
  Products,
  Transaction,
  TransactionDetail,
} = require("../models");
const MidtransService = require("./midtransService"); // <-- Impor CLASS
const whatsappService = require("./whatsappService");
const emailService = require("./emailService");
const rajaOngkirService = require("./rajaOngkirService");
const shopAddressRepository = require("../repositories/shopAddressRepository");
const midtransService = new MidtransService(); // <-- Inisialisasi INSTANCE

class TransactionService {
  _generateOrderId() {
    return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  async createTransaction(userId, checkoutData) {
    const {
      voucher_code,
      shipping_code, // Contoh input: "wahana" (KURIR)
      shipping_service, // Contoh input: "Express" (LAYANAN)
      shipping_cost, // Contoh input: 15000
    } = checkoutData;

    const t = await sequelize.transaction();
    try {
      // 1. Kunci data user & ambil keranjang
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

      // 2. Filter Item Valid & Hitung Subtotal Produk
      const validItems = [];
      let subtotal_items = 0;
      let midtransItemDetails = [];

      for (const item of user.cart_items) {
        const variant = item.variant;

        if (!variant) continue;

        // Cek stok
        const lockedVariant = await Products_Variant.findByPk(variant.id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!lockedVariant) continue;
        if (lockedVariant.stock < item.quantity) {
          throw new Error(`Stok ${variant.product.name} habis.`);
        }

        validItems.push(item);

        // Hitung Subtotal per Item
        const itemTotal = item.quantity * variant.price;
        subtotal_items += itemTotal;

        // Siapkan item untuk Midtrans (Opsional)
        midtransItemDetails.push({
          id: variant.id.toString(),
          price: parseFloat(variant.price),
          quantity: item.quantity,
          name: `${variant.product.name}`.substring(0, 50),
        });
      }

      if (validItems.length === 0) throw new Error("Tidak ada item valid.");

      // 3. Ambil Alamat
      const address = await Address.findOne({ where: { user_id: userId } });
      if (!address) throw new Error("Alamat pengiriman tidak ditemukan.");
      const shippingAddressSnapshot = JSON.stringify(address);

      // 4. Hitung Komponen Biaya (FIXED LOGIC)
      // Pastikan shipping_cost menjadi integer/float, jangan string
      const parsedShippingCost = parseFloat(shipping_cost) || 0;

      // Sesuai dokumentasi Komerce:
      // Untuk BANK TRANSFER, service_fee = 0.
      const parsedServiceFee = 0;

      let discountAmount = 0;
      if (voucher_code) {
        // (Logika voucher...)
      }

      // 5. Hitung Grand Total
      // Rumus: Produk + Ongkir + Service Fee - Diskon
      const grandTotalValue =
        subtotal_items + parsedShippingCost + parsedServiceFee - discountAmount;

      // 6. Buat Transaksi (FIXED MAPPING)
      const orderId = this._generateOrderId();

      const newTransaction = await Transaction.create(
        {
          order_id_display: orderId,
          user_id: userId,

          total_price: subtotal_items,
          shipping_cost: parsedShippingCost, // Pastikan tersimpan
          service_fee: parsedServiceFee,
          discount_amount: discountAmount,
          grand_total: grandTotalValue,

          shipping_address: shippingAddressSnapshot,

          // PERBAIKAN UTAMA DI SINI:
          courier: shipping_code, // Isi: "wahana" (bukan "Express")
          shipping_service: shipping_service, // Isi: "Express"
          shipping_code: shipping_code, // (Redundan jika ada kolom courier, tapi aman disamakan)

          status: "pending",

          // PERBAIKAN PAYMENT METHOD:
          // Default ke "BANK TRANSFER" agar sesuai Komerce (Non-COD)
          payment_method: "BANK TRANSFER",

          midtrans_token: "PENDING",
        },
        { transaction: t }
      );

      // 7. Simpan Detail Item
      let detailsToCreate = [];
      let stockUpdates = [];

      for (const item of validItems) {
        const variant = item.variant;
        detailsToCreate.push({
          transaction_id: newTransaction.id,
          variant_id: variant.id,
          quantity: item.quantity,
          price_at_purchase: variant.price,
          weight_at_purchase_grams: variant.product.weight_grams,
          product_snapshot: JSON.stringify(variant),
        });

        stockUpdates.push(
          Products_Variant.decrement("stock", {
            by: item.quantity,
            where: { id: variant.id },
            transaction: t,
          })
        );
      }

      await TransactionDetail.bulkCreate(detailsToCreate, { transaction: t });
      await Promise.all(stockUpdates);
      await Carts.destroy({ where: { user_id: userId }, transaction: t });

      // 8. Integrasi Midtrans (Opsional, untuk token pembayaran)
      // Tambahkan item ongkir ke Midtrans agar totalnya match Grand Total
      midtransItemDetails.push({
        id: "SHIP",
        price: parsedShippingCost,
        quantity: 1,
        name: "Shipping Cost",
      });

      /* Di sini Anda bisa panggil midtransService.createTransaction 
         jika ingin token asli. Untuk sekarang dummy dulu agar test lancar.
      */
      const midtransResponse = {
        token: `DUMMY-TOKEN-${Date.now()}`,
        redirect_url: "https://google.com",
      };

      await newTransaction.update(
        { midtrans_token: midtransResponse.token },
        { transaction: t }
      );

      await t.commit();

      // ... (Bagian Notifikasi WA Admin tetap sama) ...

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
  async updateTransactionStatus(
    transactionId,
    newStatus,
    manualReceiptNumber = null
  ) {
    const t = await sequelize.transaction();
    try {
      // 1. Ambil Transaksi Lengkap (Termasuk User & Detail Barang)
      const transaction = await Transaction.findByPk(transactionId, {
        include: [
          { model: User, as: "user" },
          { model: TransactionDetail, as: "details" }, // <-- PENTING: Butuh details untuk payload Komerce
        ],
        transaction: t,
      });

      if (!transaction) throw new Error("Transaksi tidak ditemukan.");

      const updateData = { status: newStatus };
      let finalReceiptNumber = manualReceiptNumber;

      // ------------------------------------------------------------------
      // LOGIKA AUTO RESI (Jika status SHIPPED & Admin tidak isi resi manual)
      // ------------------------------------------------------------------
      if (newStatus === "shipped" && !manualReceiptNumber) {
        try {
          // a. Ambil Alamat Toko
          const shopAddress =
            await shopAddressRepository.findDefaultShopAddress();
          if (!shopAddress)
            throw new Error(
              "Alamat toko belum disetting, tidak bisa booking resi."
            );

          // b. Panggil Service Komerce
          console.log(
            `Memulai booking resi otomatis untuk Order ${transaction.order_id_display}...`
          );
          const autoResi = await rajaOngkirService.createShippingOrder(
            transaction,
            shopAddress
          );

          // c. Gunakan Resi dari API
          finalReceiptNumber = autoResi;
          console.log(`Resi Otomatis didapatkan: ${finalReceiptNumber}`);
        } catch (resiError) {
          // Opsi: Mau gagalkan update status, atau biarkan update tapi tanpa resi?
          // Saran: Gagalkan biar admin tau ada masalah booking
          throw new Error(`Gagal Booking Resi: ${resiError.message}`);
        }
      }

      // Jika ada resi (baik manual atau auto), simpan
      if (finalReceiptNumber) {
        updateData.shipping_receipt_number = finalReceiptNumber;
      }

      // Update DB
      await transaction.update(updateData, { transaction: t });
      await t.commit();

      // ---------------------------------------------------------
      // NOTIFIKASI PELANGGAN
      // ---------------------------------------------------------
      try {
        const userPhone = transaction.user?.phone_number;
        const userEmail = transaction.user?.email;
        let messageUserWA = "";
        let subjectEmail = "";
        let textEmail = "";

        // ... (Logika text notifikasi sama seperti sebelumnya)
        if (newStatus === "shipped" && finalReceiptNumber) {
          messageUserWA = `Hore! Pesanan *${transaction.order_id_display}* sudah *DIKIRIM* 🚚\nResi: ${finalReceiptNumber}\n\nCek email untuk detailnya. Terima kasih!`;
          subjectEmail = `Pesanan ${transaction.order_id_display} Telah Dikirim`;
          textEmail = `Barang Anda sedang dalam perjalanan. Nomor Resi: ${finalReceiptNumber}`;
        }
        // ... (Kirim WA & Email)
        if (messageUserWA && userPhone)
          whatsappService.sendMessage(userPhone, messageUserWA);
        // ...
      } catch (notifError) {
        console.error("Gagal kirim notifikasi User:", notifError.message);
      }

      return transaction;
    } catch (error) {
      await t.rollback();
      throw new Error(`Update Status Gagal: ${error.message}`);
    }
  }
}

module.exports = new TransactionService();
