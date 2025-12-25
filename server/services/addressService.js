// server/services/addressService.js
const { Address, sequelize } = require("../models");
const { Op } = require("sequelize");

class AddressService {
  /**
   * Mendapatkan SATU alamat milik user
   */
  async getAddress(userId) {
    return Address.findOne({
      where: { user_id: userId },
    });
  }
  async createOrUpdateAddress(userId, addressData) {
    // 1. Cek dulu apakah alamat sudah ada
    const address = await this.getAddress(userId);

    // Ambil data bersih (tanpa 'label' atau 'is_default')
    const {
      recipient_name,
      recipient_phone,
      full_address,
      province_id,
      province_name,
      city_id,
      city_name,
      district_id,
      district_name,
      postal_code,
    } = addressData;

    const cleanData = {
      recipient_name,
      recipient_phone,
      full_address,
      province_id,
      province_name,
      city_id,
      city_name,
      district_id,
      district_name,
      postal_code,
    };

    if (address) {
      // --- ALAMAT SUDAH ADA (UPDATE) ---
      // Kita update berdasarkan 'address' yang sudah ditemukan
      await address.update(cleanData);
      return address;
    } else {
      // --- ALAMAT BELUM ADA (CREATE) ---
      const newAddress = await Address.create({
        ...cleanData,
        user_id: userId,
      });
      return newAddress;
    }
  }
  /**
   * Menghapus SATU alamat user
   */
  async deleteAddress(userId) {
    const deletedRows = await Address.destroy({
      where: { user_id: userId },
    });
    if (deletedRows === 0) {
      throw new Error("Address not found");
    }
    return deletedRows;
  }
}

module.exports = new AddressService();
