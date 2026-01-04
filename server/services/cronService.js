const cron = require("node-cron");
const {
  Transaction,
  TransactionDetail,
  Products_Variant,
} = require("../models");
const { Op } = require("sequelize");
const binderbyteService = require("./binderbyteService"); // <--- Import Service Tracking

class CronService {
  start() {
    console.log("⏰ [CRON] Cron Service Berjalan...");

    // ==================================================================
    // JOB 1: CEK ORDER KADALUARSA (Setiap Jam Menit ke-0)
    // ==================================================================
    cron.schedule("0 * * * *", async () => {
      console.log(">>> [CRON-1] ♻️ Cek order kadaluarsa (> 48 Jam)...");
      await this.handleExpiredTransactions();
    });

    // ==================================================================
    // JOB 2: CEK STATUS PENGIRIMAN / SWEEPER (Setiap Hari Jam 03:00 Pagi)
    // ==================================================================
    cron.schedule("0 3 * * *", async () => {
      console.log(
        ">>> [CRON-2] 🚚 Cek status pengiriman via BinderByte (Limit 5)..."
      );
      await this.handleShipmentTracking();
    });
  }

  // ------------------------------------------------------------------
  // LOGIC 1: Batalkan Transaksi Expired & Balikin Stok
  // ------------------------------------------------------------------
  async handleExpiredTransactions() {
    try {
      // Batas waktu: Sekarang dikurangi 48 jam
      const deadline = new Date(Date.now() - 48 * 60 * 60 * 1000);

      // Cari yang pending DAN dibuat sebelum deadline
      const expiredTransactions = await Transaction.findAll({
        where: {
          status: "pending",
          createdAt: { [Op.lt]: deadline },
        },
        include: [
          {
            model: TransactionDetail,
            as: "details", // Pastikan alias sesuai model Anda
          },
        ],
      });

      if (expiredTransactions.length > 0) {
        console.log(
          `[CRON-1] Ditemukan ${expiredTransactions.length} transaksi expired.`
        );

        for (const trx of expiredTransactions) {
          // 1. Kembalikan Stok
          if (trx.details && trx.details.length > 0) {
            for (const detail of trx.details) {
              await Products_Variant.increment("stock", {
                by: detail.quantity,
                where: { id: detail.variant_id },
              });
            }
          }

          // 2. Update Status jadi Cancelled
          await trx.update({ status: "cancelled" });
          console.log(
            `   -> Order ${trx.order_id_display} dibatalkan otomatis.`
          );
        }
      }
    } catch (error) {
      console.error("[CRON-1 Error]", error.message);
    }
  }

  // ------------------------------------------------------------------
  // LOGIC 2: Update Status Resi (BinderByte)
  // ------------------------------------------------------------------
  async handleShipmentTracking() {
    try {
      // Ambil 5 transaksi 'shipped' yang paling lama tidak dicek
      const transactions = await Transaction.findAll({
        where: {
          status: "shipped",
          shipping_receipt_number: { [Op.not]: null }, // Resi harus ada
          shipping_receipt_number: { [Op.ne]: "" }, // Resi tidak boleh kosong string
        },
        order: [
          ["last_tracking_check", "ASC"], // Prioritaskan yang paling lama gak dicek
        ],
        limit: 5, // AMAN UNTUK KUOTA (5 x 30 = 150 request/bulan)
      });

      if (transactions.length === 0) return;

      console.log(`[CRON-2] Memproses ${transactions.length} resi...`);

      for (const trx of transactions) {
        try {
          // Hit API BinderByte
          const trackingResult = await binderbyteService.trackPackage(
            trx.courier,
            trx.shipping_receipt_number
          );

          const statusPaket = trackingResult?.summary?.status; // 'DELIVERED', 'ON_PROCESS', dll
          const now = new Date();

          const updateData = {
            tracking_data: JSON.stringify(trackingResult),
            last_tracking_check: now,
          };

          // JIKA SUDAH SAMPAI -> Ubah status transaksi jadi 'completed'
          // BinderByte pakai istilah 'DELIVERED'
          if (statusPaket === "DELIVERED") {
            updateData.status = "completed"; // Sesuaikan enum DB kamu (completed/delivered)
            console.log(
              `   -> ✅ Paket ${trx.order_id_display} SUDAH SAMPAI. Status: COMPLETED.`
            );
          } else {
            console.log(
              `   -> 📦 Paket ${trx.order_id_display} masih di jalan (${statusPaket}).`
            );
          }

          // Simpan ke DB
          await trx.update(updateData);
        } catch (err) {
          console.error(
            `   -> [Skip] Gagal cek ${trx.order_id_display}: ${err.message}`
          );
          // Update last_check agar besok tidak macet di sini terus, tapi beri jeda waktu
          await trx.update({ last_tracking_check: new Date() });
        }
      }
    } catch (error) {
      console.error("[CRON-2 Fatal Error]", error.message);
    }
  }
}

module.exports = new CronService();
