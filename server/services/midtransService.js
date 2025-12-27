// server/services/midtransService.js
const midtransClient = require("midtrans-client");

class MidtransService {
  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: false, // Sandbox Mode
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }

  async createTransaction(params) {
    try {
      // Kita pakai createTransaction (bukan createTransactionToken)
      // supaya dapat token DAN redirect_url
      const transaction = await this.snap.createTransaction(params);
      return transaction; // Output: { token: "...", redirect_url: "https://..." }
    } catch (error) {
      throw new Error(`Midtrans Error: ${error.message}`);
    }
  }
}

module.exports = MidtransService;
