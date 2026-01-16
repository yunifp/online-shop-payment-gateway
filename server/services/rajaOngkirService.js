// server/services/rajaOngkirService.js
const axios = require("axios");
const cartRepository = require("../repositories/cartRepository");
const shopAddressRepository = require("../repositories/shopAddressRepository");
const {
  Products_Variant,
  Address,
  Carts,
  Products,
  // Import Model Wilayah Baru
  Province,
  City,
  District,
  SubDistrict,
} = require("../models");
// 1. Buat instance axios untuk API Komerce
function parseEtd(etd) {
  if (!etd || typeof etd !== "string" || etd.trim() === "") return 99;
  // Ambil angka pertama yang muncul (misal "2-3 Hari" -> ambil "2")
  const match = etd.match(/^(\d+)/);
  if (match && match[1]) return parseInt(match[1], 10);
  return 99; // Kalau tidak ada angka, taruh di urutan paling belakang
}
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
      const dbResult = await Province.findAll();

      if (dbResult.length > 0) {
        return dbResult.map((row) => JSON.parse(row.data));
      }

      console.log("📡 Fetching Provinces from Komerce API...");
      const response = await komerceApi.get("/destination/province");
      const apiResults = response.data.data;

      if (!apiResults) return [];

      const bulkData = apiResults.map((p) => ({
        province_id: p.province_id || p.id,
        data: JSON.stringify(p),
      }));

      await Province.bulkCreate(bulkData, {
        updateOnDuplicate: ["data"], // Provinsi tidak punya parent, aman.
      });

      return apiResults;
    } catch (error) {
      console.error("Service Error:", error.message);
      throw new Error(`Gagal mengambil provinsi: ${error.message}`);
    }
  }

  async getCities(provinceId) {
    if (!provinceId) throw new Error("Province ID is required");
    try {
      const dbResult = await City.findAll({
        where: { province_id: provinceId },
      });

      if (dbResult.length > 0) {
        return dbResult.map((row) => JSON.parse(row.data));
      }

      console.log(`📡 Fetching Cities Prov ${provinceId}...`);
      const response = await komerceApi.get(`/destination/city/${provinceId}`);
      const apiResults = response.data.data;

      if (!apiResults) return [];

      const bulkData = apiResults.map((c) => ({
        city_id: c.city_id || c.id,
        province_id: parseInt(provinceId), // Paksa sesuai input
        data: JSON.stringify(c),
      }));

      // 🔥 FIX PENTING: Update province_id juga kalau data sudah ada!
      await City.bulkCreate(bulkData, {
        updateOnDuplicate: ["data", "province_id"],
      });

      return apiResults;
    } catch (error) {
      throw new Error(`Gagal mengambil kota: ${error.message}`);
    }
  }

  async getDistricts(cityId) {
    if (!cityId) throw new Error("City ID is required");
    try {
      const dbResult = await District.findAll({ where: { city_id: cityId } });

      if (dbResult.length > 0) {
        return dbResult.map((row) => JSON.parse(row.data));
      }

      console.log(`📡 Fetching Districts City ${cityId}...`);
      const response = await komerceApi.get(`/destination/district/${cityId}`);
      const apiResults = response.data.data;

      if (!apiResults) return [];

      const bulkData = apiResults.map((d) => ({
        district_id: d.subdistrict_id || d.id,
        city_id: parseInt(cityId),
        data: JSON.stringify(d),
      }));

      // 🔥 FIX PENTING: Update city_id juga!
      await District.bulkCreate(bulkData, {
        updateOnDuplicate: ["data", "city_id"],
      });

      return apiResults;
    } catch (error) {
      throw new Error(`Gagal mengambil kecamatan: ${error.message}`);
    }
  }

  async getSubDistricts(districtId) {
    if (!districtId) throw new Error("District ID is required");
    try {
      // UBAH: Panggil model SubDistrict
      const dbResult = await SubDistrict.findAll({
        where: { district_id: districtId },
      });

      if (dbResult.length > 0) {
        return dbResult.map((row) => JSON.parse(row.data));
      }

      console.log(`📡 Fetching SubDistricts District ${districtId}...`);
      const response = await komerceApi.get(
        `/destination/sub-district/${districtId}`
      );
      const apiResults = response.data.data;

      if (!apiResults) return [];

      const bulkData = apiResults.map((v) => ({
        // UBAH: Mapping ke sub_district_id
        sub_district_id: v.id || v.subdistrict_id,
        district_id: parseInt(districtId),
        data: JSON.stringify(v),
      }));

      // UBAH: Bulk Create ke SubDistrict
      await SubDistrict.bulkCreate(bulkData, {
        updateOnDuplicate: ["data", "district_id"],
      });

      return apiResults;
    } catch (error) {
      throw new Error(`Gagal mengambil sub-district: ${error.message}`);
    }
  }
  /**
   * Menghitung ongkos kirim (sesuai logika Anda)
   * @param {string} userId - ID User yang sedang login
   * @param {string} weight - Berat dalam gram (dari req.body)
   */
  async getShippingCost(userId) {
    // 1. Ambil Barang di Keranjang
    const items = await Carts.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Products_Variant,
          as: "variant",
          include: [
            { model: Products, as: "product", attributes: ["weight_grams"] },
          ],
        },
      ],
    });

    if (!items || items.length === 0) throw new Error("Keranjang kosong");

    // 2. Hitung Berat Total
    let totalWeight = 0;
    for (const item of items) {
      const w = item.variant?.product?.weight_grams;
      if (w) totalWeight += w * item.quantity;
    }
    if (totalWeight === 0) totalWeight = 1000; // Minimal 1kg

    // 3. Ambil Alamat Toko & User
    const shopAddress = await shopAddressRepository.findDefaultShopAddress();
    const userAddress = await Address.findOne({ where: { user_id: userId } });

    if (!shopAddress) throw new Error("Alamat toko belum diatur Admin.");
    if (!userAddress) throw new Error("Alamat pengiriman user belum lengkap.");

    try {
      const params = new URLSearchParams();
      params.append("origin", shopAddress.district_id);
      params.append("destination", userAddress.district_id);
      params.append("weight", totalWeight);

      // 🔥 PERBAIKAN DISINI 🔥
      // Salah: "jne:sicepat:jnt:idexpress"
      // Benar: "jne:sicepat:jnt:ide" (ID Express kodenya 'ide')
      params.append("courier", "jne:sicepat:jnt:ide");

      // Hitung via API Komerce
      const response = await komerceApi.post(
        "/calculate/district/domestic-cost",
        params
      );
      const rawResults = response.data.data;

      if (!Array.isArray(rawResults)) return { data: [] };

      // 4. Filter & Sort Hasil
      const cleanedResults = rawResults
        .map((item) => ({
          ...item,
          parsedEtd: parseEtd(item.etd),
        }))
        .filter((i) => i.cost > 0 && i.cost < 2000000 && i.parsedEtd < 99)
        .sort((a, b) => a.cost - b.cost);

      return {
        origin: response.data.origin,
        destination: response.data.destination,
        results: cleanedResults.slice(0, 3), // Ambil Top 3
      };
    } catch (error) {
      console.error("Ongkir API Error:", error.response?.data || error.message);
      // Tampilkan pesan error asli dari API agar lebih mudah debug
      const msg = error.response?.data?.meta?.message || error.message;
      throw new Error(`Gagal Cek Ongkir: ${msg}`);
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
