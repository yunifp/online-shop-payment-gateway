// server/routes/trackingRoutes.js
const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");
const authenticate = require("../middleware/authenticate"); // Opsional

router.get("/order/:orderId", authenticate, trackingController.trackByOrderId);

module.exports = router;
