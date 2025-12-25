// server/routes/addressRoutes.js
const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authenticate = require("../middleware/authenticate");
const isVerified = require("../middleware/isVerified"); //

router.use(authenticate, isVerified);

// GET /api/v1/addresses/ (Dapatkan semua alamat user)
router.get("/", addressController.getMyAddress); // <-- Ini sekarang cocok

router.post("/", addressController.createOrUpdateAddress);

// PUT /api/v1/address/ (mengupdate alamat Anda)
router.put("/", addressController.createOrUpdateAddress);

// DELETE /api/v1/address/ (menghapus alamat Anda)
router.delete("/", addressController.deleteMyAddress);

module.exports = router;