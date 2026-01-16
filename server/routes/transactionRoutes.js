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
router.get(
  "/dashboard-stats",
  adminOrStaff,
  transactionController.getDashboardStats
);
router.get("/history", transactionController.getMyTransactions);
router.get("/", adminOrStaff, transactionController.getAllTransactions);
router.get("/:id", transactionController.getDetail);
router.post("/prepare", transactionController.prepare);
router.post("/", transactionController.createTransaction);
router.get(
  "/dashboard-stats",
  adminOrStaff, 
  transactionController.getDashboardStats
);
router.put(
  "/:id/status",
  adminOrStaff, // Middleware proteksi tambahan
  transactionController.updateStatus
);
router.post(
  "/midtrans/notification",
  transactionController.midtransNotification
);
router.post("/:id/repay", transactionController.repay);
router.get("/:id", transactionController.getDetail);
module.exports = router;
