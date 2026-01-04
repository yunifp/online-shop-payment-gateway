// server/controllers/transactionController.js
const transactionService = require("../services/transactionService");

class TransactionController {
  async getMyTransactions(req, res) {
    try {
      const userId = req.user.id; // Diambil dari Token (Middleware authenticate)
      const queryParams = req.query; // ?page=1&status=paid

      const result = await transactionService.getUserTransactions(
        userId,
        queryParams
      );

      res.success(result, "Riwayat transaksi Anda berhasil diambil.");
    } catch (error) {
      res.error(error.message, 500);
    }
  }
  async getAllTransactions(req, res) {
    try {
      // Ambil parameter dari URL (misal: ?page=1&status=paid&search=TRX-123)
      const queryParams = req.query;

      const result = await transactionService.getAllTransactions(queryParams);

      res.success(result, "Data transaksi berhasil diambil.");
    } catch (error) {
      res.error(error.message, 500);
    }
  }
  async getDetail(req, res) {
    try {
      const { id } = req.params;

      // Panggil service yang "BERAT" tadi
      const result = await transactionService.getTransactionById(id);

      // Validasi keamanan:
      // Jika user biasa (bukan admin) mencoba lihat detail transaksi orang lain -> TOLAK
      if (req.user.role === "customer" && result.user_id !== req.user.id) {
        return res.error("Anda tidak berhak melihat transaksi ini.", 403);
      }

      res.success(result, "Detail transaksi berhasil diambil.");
    } catch (error) {
      res.error(error.message, 404);
    }
  }
  async createTransaction(req, res) {
    try {
      const userId = req.user.id;
      const result = await transactionService.createTransaction(
        userId,
        req.body
      );
      res.success(
        result,
        "Transaksi berhasil dibuat, menunggu pembayaran.",
        201
      );
    } catch (error) {
      res.error(error.message, 400);
    }
  }
  async updateStatus(req, res) {
    try {
      const { id } = req.params; // ID Transaksi
      const { status, shipping_receipt_number } = req.body; // Input dari Admin

      if (!status) {
        return res.error("Status baru diperlukan.", 400);
      }

      // Validasi sederhana status yang diperbolehkan
      const allowedStatuses = [
        "pending",
        "paid",
        "processing",
        "shipped",
        "completed",
        "failed",
        "cancelled",
      ];
      if (!allowedStatuses.includes(status)) {
        return res.error("Status tidak valid.", 400);
      }

      // Panggil service (yang sudah ada notif WA-nya)
      const result = await transactionService.updateTransactionStatus(
        id,
        status,
        shipping_receipt_number
      );

      res.success(result, "Status transaksi berhasil diperbarui.");
    } catch (error) {
      res.error(error.message, 400);
    }
  }
  async midtransNotification(req, res) {
    try {
      // Tangkap data notifikasi dari Body Request
      const notificationBody = req.body;

      // Kirim ke Service untuk diproses (update status DB jadi 'paid')
      await transactionService.handleMidtransNotification(notificationBody);

      // Balas 'OK' ke Midtrans supaya mereka tau notifikasi sudah diterima
      res.status(200).send("OK");
    } catch (error) {
      console.error("Midtrans Notification Controller Error:", error.message);
      // Tetap kirim 200 agar Midtrans tidak mengirim ulang notifikasi terus-menerus
      res.status(200).send("OK");
    }
  }
  async repay(req, res) {
    try {
      const { id } = req.params; // ID Transaksi
      const result = await transactionService.repayTransaction(id);
      res.success(result, "Link pembayaran baru berhasil dibuat.");
    } catch (error) {
      res.error(error.message, 400);
    }
  }
}


module.exports = new TransactionController();
