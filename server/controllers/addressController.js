// server/controllers/addressController.js
const addressService = require("../services/addressService"); //

class AddressController {
  // CREATE
  async getMyAddress(req, res) {
    try {
      const address = await addressService.getAddress(req.user.id);
      if (!address) {
        return res.success(null, "No address found for this user.");
      }
      res.success(address, "Address retrieved");
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  // UPDATE
  async createOrUpdateAddress(req, res) {
    try {
      const address = await addressService.createOrUpdateAddress(
        req.user.id,
        req.body
      );
      res.success(address, "Address saved successfully", 200);
    } catch (error) {
      res.error(error.message, 400);
    }
  }

  // DELETE
  async deleteMyAddress(req, res) {
    try {
      await addressService.deleteAddress(req.user.id);
      res.success(null, "Address deleted successfully");
    } catch (error) {
      res.error(error.message, 404);
    }
  }
}
module.exports = new AddressController();
