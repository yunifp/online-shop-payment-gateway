// server/controllers/trackingController.js
const binderbyteService = require("../services/binderbyteService");
const { Transaction } = require("../models");

class TrackingController {
  async trackByOrderId(req, res) {
    try {
      const { orderId } = req.params;

      // 1. Ambil Transaksi
      const transaction = await Transaction.findOne({
        where: { order_id_display: orderId },
      });

      if (!transaction) throw new Error("Transaksi tidak ditemukan.");
      if (!transaction.shipping_receipt_number)
        throw new Error("Pesanan belum dikirim (belum ada resi).");

      // ============================================================
      // 🧠 LOGIKA PENGHEMAT KUOTA (SMART CACHING)
      // ============================================================

      const now = new Date();
      const lastCheck = transaction.last_tracking_check
        ? new Date(transaction.last_tracking_check)
        : null;

      // Hitung selisih waktu (dalam jam)
      let hoursDiff = 999;
      if (lastCheck) {
        const diffMs = now - lastCheck;
        hoursDiff = diffMs / (1000 * 60 * 60);
      }

      // Ambil data lama (jika ada)
      let trackingData = transaction.tracking_data
        ? JSON.parse(transaction.tracking_data)
        : null;
      let statusPaket = trackingData?.summary?.status; // DELIVERED / ON_PROCESS

      // KEPUTUSAN: Kapan harus tembak API BinderByte?
      // 1. Jika data belum pernah ada (null).
      // 2. ATAU Jika status paket BELUM 'DELIVERED' DAN data sudah basi (> 6 jam).
      //    (Kenapa 6 jam? Kurir biasanya update pagi, siang, sore. Tidak tiap menit).

      const shouldCallApi = !trackingData || (statusPaket !== "DELIVERED" && hoursDiff >= 6);

      if (shouldCallApi) {
        console.log(
          `[Tracking] Menghubungi API BinderByte untuk ${orderId}... (Pakai Kuota)`
        );

        try {
          // 1. Tembak API
          const apiResult = await binderbyteService.trackPackage(
            transaction.courier,
            transaction.shipping_receipt_number
          );

          // 2. SIAPKAN DATA UPDATE
          // Kita tampung dulu di variabel objek biar rapi
          const dataToUpdate = {
            tracking_data: JSON.stringify(apiResult),
            last_tracking_check: now,
          };

          // 3. LOGIKA UPDATE STATUS (INI YANG KEMARIN HILANG)
          // Cek status dari BinderByte
          const statusDariKurir = apiResult.summary.status; // Contoh: 'DELIVERED', 'ON_PROCESS'

          console.log(`[Tracking] Status dari Kurir: ${statusDariKurir}`);

          if (statusDariKurir === "DELIVERED") {
            // Jika kurir bilang sampai, ubah status database kita jadi 'completed'
            // (Sesuaikan dengan enum di database Anda, misal 'completed' atau 'finished')
            dataToUpdate.status = "completed";
            console.log(
              `[Tracking] 🎉 Auto-Update status transaksi jadi COMPLETED`
            );
          }

          // 4. Eksekusi Update ke Database
          await transaction.update(dataToUpdate);

          // Update variabel lokal agar respons ke user langsung fresh
          trackingData = apiResult;
        } catch (apiError) {
          // Jika kuota habis atau error API, tapi kita punya data lama di DB
          // Tampilkan data lama saja daripada error kosong, sambil kasih info
          if (trackingData) {
            console.warn(
              "API Error, menampilkan data cache lama:",
              apiError.message
            );
            return res.success(
              {
                ...trackingData,
                is_cached: true,
                warning:
                  "Sistem tracking sedang sibuk, menampilkan data terakhir.",
              },
              "Data pelacakan (tercache) berhasil diambil."
            );
          }
          throw apiError; // Jika tidak punya data lama sama sekali, baru throw error
        }
      } else {
        console.log(
          `[Tracking] Menggunakan Data Cache DB untuk ${orderId}. (Hemat Kuota)`
        );
      }

      // Return Data
      res.success(trackingData, "Data pelacakan berhasil diambil.");
    } catch (error) {
      res.error(error.message, 400);
    }
  }
}

module.exports = new TrackingController();
