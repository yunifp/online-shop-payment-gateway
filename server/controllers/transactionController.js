// server/controllers/transactionController.js
const transactionService = require("../services/transactionService");

class TransactionController {
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
      const { status, receipt_number } = req.body; // Input dari Admin

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
        receipt_number
      );

      res.success(result, "Status transaksi berhasil diperbarui.");
    } catch (error) {
      res.error(error.message, 400);
    }
  }
}

module.exports = new TransactionController();
