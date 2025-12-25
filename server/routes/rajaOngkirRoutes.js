// server/routes/rajaOngkirRoutes.js
const express = require("express");
const router = express.Router();
const rajaOngkirController = require("../controllers/rajaOngkirController");
const authenticate = require("../middleware/authenticate"); //

// Lindungi semua rute ini, hanya user ter-login yang bisa cek
router.use(authenticate);

// GET /api/v1/shipping/provinces
router.get("/provinces", rajaOngkirController.getProvinces);

// GET /api/v1/shipping/cities/:provinceId
router.get("/cities/:provinceId", rajaOngkirController.getCities);

// GET /api/v1/shipping/districts/:cityId
router.get("/districts/:cityId", rajaOngkirController.getDistricts);

// GET /api/v1/shipping/sub-districts/:districtId
router.get("/sub-districts/:districtId", rajaOngkirController.getSubDistricts);

router.post("/cost", rajaOngkirController.getShippingCost);

module.exports = router;
