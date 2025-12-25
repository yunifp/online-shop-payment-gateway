// server/controllers/rajaOngkirController.js
const rajaOngkirService = require("../services/rajaOngkirService");

class RajaOngkirController {
  async getProvinces(req, res) {
    try {
      const provinces = await rajaOngkirService.getProvinces();
      res.success(provinces, "Provinces retrieved");
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  async getCities(req, res) {
    try {
      // Ambil 'provinceId' dari parameter URL
      const { provinceId } = req.params;
      const cities = await rajaOngkirService.getCities(provinceId);
      res.success(cities, "Cities retrieved");
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  async getDistricts(req, res) {
    try {
      const { cityId } = req.params;
      const districts = await rajaOngkirService.getDistricts(cityId);
      res.success(districts, "Districts retrieved");
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  async getSubDistricts(req, res) {
    try {
      const { districtId } = req.params;
      const subDistricts = await rajaOngkirService.getSubDistricts(districtId);
      res.success(subDistricts, "Sub-districts retrieved");
    } catch (error) {
      res.error(error.message, 500);
    }
  }
  async getShippingCost(req, res) {
    try {
      const userId = req.user.id;// Ambil berat dari body

      const shippingOptions = await rajaOngkirService.getShippingCost(
        userId,
      );
      res.success(shippingOptions, "Shipping options retrieved");
    } catch (error) {
      res.error(error.message, 500);
    }
  }
}

module.exports = new RajaOngkirController();
