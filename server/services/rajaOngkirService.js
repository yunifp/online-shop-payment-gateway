// server/services/rajaOngkirService.js
const axios = require("axios");
const cartRepository = require("../repositories/cartRepository");
const shopAddressRepository = require("../repositories/shopAddressRepository");
const { Products_Variant, Address, Carts, Products } = require("../models");
// 1. Buat instance axios untuk API Komerce

// Perhatikan baseURL BARU
const komerceApi = axios.create({
  baseURL: "https://rajaongkir.komerce.id/api/v1",
  headers: {
    // MARI KITA COBA 'x-api-key'. INI STANDAR UMUM.
    key: process.env.KOMERCE_API_KEY,
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
const komerceOrder = axios.create({
  baseURL: "https://api-sandbox.collaborator.komerce.id/order/api/v1",
  headers: {
    "x-api-key": process.env.KOMERCE_ORDER_API_KEY, // Header baru: 'x-api-key'
  },
});

class RajaOngkirService {
  _formatPhone(phone) {
    if (!phone) return "628000000000"; // Fallback dummy
    let p = phone.replace(/[^0-9]/g, ""); // Hapus simbol

    if (p.startsWith("08")) {
      return "62" + p.substring(1); // 0812 -> 62812
    }
    if (p.startsWith("62")) {
      return p; // Sudah benar
    }
    if (p.startsWith("8")) {
      return "62" + p; // 812 -> 62812
    }
    return p;
  }
  /**
   * Mengambil semua provinsi
   * GET /destination/province
   */
  async getProvinces() {
    try {
      const response = await komerceApi.get("/destination/province");
      return response.data; // Sesuaikan berdasarkan respons JSON aslinya
    } catch (error) {
      throw new Error(`Komerce API Error (Provinces): ${error.message}`);
    }
  }

  /**
   * Mengambil kota/kabupaten berdasarkan ID provinsi
   * GET /destination/city/{province_id}
   */
  async getCities(provinceId) {
    if (!provinceId) {
      throw new Error("Province ID is required");
    }
    try {
      const response = await komerceApi.get(`/destination/city/${provinceId}`);
      return response.data; // Sesuaikan
    } catch (error) {
      throw new Error(`Komerce API Error (Cities): ${error.message}`);
    }
  }

  /**
   * Mengambil kecamatan berdasarkan ID kota
   * GET /destination/district/{city_id}
   */
  async getDistricts(cityId) {
    if (!cityId) {
      throw new Error("City ID is required");
    }
    try {
      const response = await komerceApi.get(`/destination/district/${cityId}`);
      return response.data; // Sesuaikan
    } catch (error) {
      throw new Error(`Komerce API Error (Districts): ${error.message}`);
    }
  }

  /**
   * Mengambil desa/kelurahan berdasarkan ID kecamatan
   * GET /destination/sub-district/{district_id}
   */
  async getSubDistricts(districtId) {
    if (!districtId) {
      throw new Error("District ID is required");
    }
    try {
      const response = await komerceApi.get(
        `/destination/sub-district/${districtId}`
      );
      return response.data; // Sesuaikan
    } catch (error) {
      throw new Error(`Komerce API Error (SubDistricts): ${error.message}`);
    }
  }

  /**
   * Mengubah string ETD (misal: "2-4 day") menjadi angka (misal: 2)
   * @param {string} etd - String estimasi hari
   * @returns {number} - Angka hari (terendah)
   */
  _parseEtd(etd) {
    if (!etd || typeof etd !== "string" || etd.trim() === "") {
      return 99; // Beri penalti tinggi jika ETD tidak ada (seperti J&T)
    }

    // Mengambil angka pertama dari string (misal: "2-4 day" -> 2, "3 day" -> 3)
    const match = etd.match(/^(\d+)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 99; // Penalti jika format tidak dikenal
  }
  /**
   * Menghitung ongkos kirim (sesuai logika Anda)
   * @param {string} userId - ID User yang sedang login
   * @param {string} weight - Berat dalam gram (dari req.body)
   */
  async getShippingCost(userId) {
    // 1. Dapatkan Alamat Asal (Toko)
    const items = await Carts.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Products_Variant,
          as: "variant",
          include: [
            {
              model: Products,
              as: "product",
              attributes: ["weight_grams"], // Kita hanya butuh beratnya
            },
          ],
        },
      ],
    });

    if (!items || items.length === 0) {
      throw new Error("Your cart is empty.");
    }

    // b. Akumulasikan berat
    let totalWeight = 0;
    for (const item of items) {
      // Gunakan optional chaining (?) untuk keamanan
      const itemWeight = item.variant?.product?.weight_grams;
      if (itemWeight && itemWeight > 0) {
        totalWeight += itemWeight * item.quantity;
      }
    }

    if (totalWeight <= 0) {
      throw new Error("Cart is empty or items in cart have no weight defined.");
    }

    // c. Gunakan 'totalWeight' sebagai 'weight' untuk API
    const weight = totalWeight;

    const shopAddress = await shopAddressRepository.findDefaultShopAddress();
    if (!shopAddress || !shopAddress.district_id) {
      throw new Error("Alamat asal toko belum diatur oleh admin.");
    }
    const originDistrictId = shopAddress.district_id;

    // 2. Dapatkan Alamat Tujuan (Pelanggan)
    const userAddress = await Address.findOne({ where: { user_id: userId } });
    if (!userAddress || !userAddress.district_id) {
      throw new Error(
        "Alamat pelanggan tidak ditemukan atau tidak lengkap (membutuhkan district_id)."
      );
    }
    const destinationDistrictId = userAddress.district_id;

    // 3. Panggil API Komerce (sesuai cURL Anda)
    try {
      const params = new URLSearchParams();
      params.append("origin", originDistrictId);
      params.append("destination", destinationDistrictId);
      params.append("weight", weight);
      params.append(
        "courier",
        "jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse"
      );

      const response = await komerceApi.post(
        "/calculate/district/domestic-cost",
        params, // Kirim sebagai form-urlencoded
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const rawResults = response.data.data; // Ini adalah array

      if (!Array.isArray(rawResults)) {
        // Jika Komerce mengembalikan error atau format aneh
        return response.data;
      }

      // 4. Bersihkan, Ubah, dan Filter data
      const cleanedResults = rawResults
        .map((item) => {
          // "Tiki Motor..." memiliki cost 1,000,000+. Kita buang.
          // "J&T EZ" memiliki ETD "" (string kosong). Kita parse.
          const parsedEtd = this._parseEtd(item.etd);

          return {
            ...item,
            parsedEtd: parsedEtd, // Tambah properti baru untuk sortir
          };
        })
        .filter(
          (item) =>
            item.cost > 0 && // Buang jika gratis (tidak logis)
            item.cost < 500000 && // Buang layanan kargo/motor (Rp 1jt+)
            item.parsedEtd < 99 // Buang yang ETD-nya kosong/tidak jelas
        );

      // 5. Sortir data (sesuai kriteria Anda)
      // Kriteria 1: "cost" termurah
      // Kriteria 2: "etd" tercepat
      cleanedResults.sort((a, b) => {
        if (a.cost < b.cost) return -1; // Biaya termurah didahulukan
        if (a.cost > b.cost) return 1;

        // Jika biaya sama, dahulukan yang tercepat
        if (a.parsedEtd < b.parsedEtd) return -1;
        if (a.parsedEtd > b.parsedEtd) return 1;

        return 0; // Jika semua sama
      });

      // 6. Ambil 3 terbaik
      const top3Results = cleanedResults.slice(0, 3);

      // 7. Kembalikan data yang sudah difilter
      // Kita modifikasi respons aslinya
      response.data.data = top3Results;
      return response.data;
    } catch (error) {
      throw new Error(`Komerce API Error (Cost): ${error.message}`);
    }
  }
  /**
   * Membuat Order Pengiriman ke Komerce untuk mendapatkan Resi
   * @param {Object} transaction - Data transaksi dari DB
   * @param {Object} shopAddress - Data alamat toko
   */
  async createShippingOrder(transaction, shopAddress) {
    try {
      // 1. Validasi Alamat Penerima
      let receiverAddr;
      try {
        receiverAddr = JSON.parse(transaction.shipping_address);
      } catch (e) {
        throw new Error("Format alamat penerima di transaksi rusak.");
      }

      // 2. Persiapan Data Produk (Order Details)
      // Kita hitung ulang subtotal produk untuk memastikan akurasi Grand Total
      let productSubtotalAccumulated = 0;

      const orderDetails = transaction.details.map((detail) => {
        let productData = {};
        try {
          productData = JSON.parse(detail.product_snapshot || "{}");
        } catch (e) {}

        const pName = productData.product?.name || "Produk";
        const vName = `${productData.color || ""} ${
          productData.size || ""
        }`.trim();
        const price = parseInt(detail.price_at_purchase); // Pastikan int
        const qty = parseInt(detail.quantity);
        const subtotal = price * qty;

        productSubtotalAccumulated += subtotal;

        return {
          product_name: pName.substring(0, 50),
          product_variant_name: vName || "-",
          product_price: price,
          product_weight: parseInt(detail.weight_at_purchase_grams) || 1000,
          product_width: 10,
          product_height: 10,
          product_length: 10,
          qty: qty,
          subtotal: subtotal,
        };
      });

      // 3. Konfigurasi Waktu (YYYY-MM-DD HH:mm:ss)
      // Dokumentasi meminta 'date-time'
      const today = new Date();
      // Mengubah ke format lokal (WIB) ISO string sederhana
      const offset = 7 * 60; // WIB is UTC+7
      const localTime = new Date(today.getTime() + offset * 60 * 1000);
      const orderDateStr = localTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // 4. Konfigurasi Pembayaran & Biaya
      // Cek apakah payment_method mengandung 'COD' (Case Insensitive)
      const isCOD =
        transaction.payment_method &&
        transaction.payment_method.toUpperCase().includes("COD");

      // Sesuai Screenshot: "COD" atau "Bank Transfer"
      const paymentMethodStr = isCOD ? "COD" : "BANK TRANSFER";

      const shippingCost = parseInt(transaction.shipping_cost);
      const additionalCost = 0; // Default 0
      const shippingCashback = 0; // Default 0
      const insuranceValue = 0;

      // Hitung Grand Total Sesuai Rumus Dokumentasi:
      // product total + shipping cost + additional cost - shipping cashback
      const grandTotal =
        productSubtotalAccumulated +
        shippingCost +
        additionalCost -
        shippingCashback;

      // Hitung COD Value
      // Screenshot: "COD payment amount. This value must match the grand_total."
      // Jika Bank Transfer, kita set 0 atau grandTotal? Dokumentasi bilang match grand_total.
      // Untuk aman: Jika COD = grandTotal, Jika Transfer = 0 (biasanya API menolak value di field COD jika tipe transfer)
      const codValue = isCOD ? grandTotal : 0;

      // Hitung Service Fee (Sesuai Screenshot)
      // "2.8% from cod_value, service_fee = 0 for BANK TRANSFER"
      // PENTING: Jangan pakai Math.round sembarangan, pakai parseInt/floor untuk memastikan INT.
      let serviceFee = 0;
      if (isCOD) {
        serviceFee = parseInt(codValue * 0.028);
      }

      // Pastikan Nama Kurir Uppercase (JNE, SICEPAT, dll)
      const courierName = (transaction.courier || "JNE").toUpperCase();

      // 5. Penyusunan Payload (WAJIB SERTAKAN SEMUA FIELD BERTANDA *)
      // Dokumentasi menunjukkan field seperti service_fee, additional_cost dll bertanda *.
      // Jadi kita WAJIB mengirimnya meski nilainya 0.

      const payload = {
        order_date: orderDateStr,
        brand_name: "Toko Panjat Tebing",

        // Data Pengirim
        shipper_name: "Admin Toko",
        shipper_phone: this._formatPhone(shopAddress.phone_number),
        shipper_destination_id: parseInt(shopAddress.district_id),
        shipper_address: shopAddress.full_address || "Alamat Toko",
        shipper_email: "admin@tokopanjattebing.com",
        origin_pin_point: "-6.917464, 107.619122",

        // Data Penerima
        receiver_name: receiverAddr.recipient_name,
        receiver_phone: this._formatPhone(receiverAddr.recipient_phone),
        receiver_destination_id: parseInt(receiverAddr.district_id),
        receiver_address: receiverAddr.full_address,
        receiver_email: "customer@example.com", // Tambahkan dummy jika user tidak ada email
        destination_pin_point: "-6.917464, 107.619122",

        // Data Ekspedisi
        shipping: courierName,
        shipping_type: transaction.shipping_service,

        // Data Keuangan (SEMUA FIELD WAJIB DIKIRIM SEBAGAI INT)
        payment_method: paymentMethodStr,
        shipping_cost: shippingCost,
        shipping_cashback: shippingCashback, // Wajib ada (*)
        service_fee: serviceFee, // Wajib ada (*)
        additional_cost: additionalCost, // Wajib ada (*)
        cod_value: codValue, // Wajib ada (*)
        grand_total: grandTotal, // Wajib ada (*)
        insurance_value: insuranceValue,

        // Detail Produk
        order_details: orderDetails,
      };

      console.log(
        ">>> Sending Order to Komerce (STRICT):",
        JSON.stringify(payload, null, 2)
      );

      // 6. Eksekusi Request
      const response = await komerceOrder.post("/orders/store", payload);

      // 7. Parsing Response
      // Sesuai Screenshot Response: { data: { order_id: ..., order_no: "..." } }
      const responseData = response.data.data;

      // Ambil order_no sesuai request Anda
      const resi = responseData.order_no;

      console.log(">>> Booking Success! Order No:", resi);
      return resi;
    } catch (error) {
      console.error("\n========== KOMERCE ORDER FAILED ==========");

      if (error.response) {
        console.error("HTTP Status:", error.response.status);
        console.error(
          "Response Data:",
          JSON.stringify(error.response.data, null, 2)
        );

        const metaMsg = error.response.data?.meta?.message;
        const dataMsg = error.response.data?.data; // Kadang error detail ada di data
        const finalMsg =
          metaMsg || (typeof dataMsg === "string" ? dataMsg : "Check Params");

        throw new Error(`Komerce Reject: ${finalMsg}`);
      } else {
        console.error("System Error:", error.message);
        throw new Error(`Komerce Connection Error: ${error.message}`);
      }
    }
  }
}

module.exports = new RajaOngkirService();
