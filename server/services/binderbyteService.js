// server/services/binderbyteService.js
const axios = require("axios");

class BinderbyteService {
  constructor() {
    this.apiKey = process.env.BINDERBYTE_API_KEY;
    this.baseUrl = "https://api.binderbyte.com/v1";
  }

  async trackPackage(courier, awb) {
    try {
      if (!courier || !awb) {
        throw new Error("Kurir dan No Resi (AWB) wajib diisi.");
      }

      // Request ke BinderByte
      const response = await axios.get(`${this.baseUrl}/track`, {
        params: {
          api_key: this.apiKey,
          courier: courier.toLowerCase(), // Binderbyte minta huruf kecil (jne, jnt, dll)
          awb: awb,
        },
      });

      const data = response.data;

      // Cek apakah API merespon sukses (status 200 dari Binderbyte)
      if (data.status !== 200) {
        throw new Error(data.message || "Gagal melacak paket.");
      }

      return data.data; // Mengembalikan data tracking inti
    } catch (error) {
      // Handle error dari axios atau API
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Tracking Error: ${errorMessage}`);
    }
  }

  // Opsional: Cek daftar kurir yang disupport
  async getSupportedCouriers() {
    try {
      const response = await axios.get(`${this.baseUrl}/list_courier`, {
        params: { api_key: this.apiKey },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  }
}

module.exports = new BinderbyteService();
