// server/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authenticate = require("../middleware/authenticate");
const isVerified = require("../middleware/isVerified"); 
const adminOrStaff = require("../middleware/adminOrStaff");

// Lindungi SEMUA rute transaksi.
// User WAJIB login DAN terverifikasi email-nya untuk checkout
router.use(authenticate, isVerified);

// POST /api/v1/transactions/
// Ini adalah endpoint "Checkout"
router.post("/", transactionController.createTransaction);
router.put(
  "/:id/status",
  adminOrStaff, // Middleware proteksi tambahan
  transactionController.updateStatus
);
router.post(
  "/midtrans/notification",
  transactionController.midtransNotification
);
router.post("/transactions/:id/repay", transactionController.repay);
module.exports = router;
