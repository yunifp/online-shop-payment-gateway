// server/services/midtransService.js
const midtransClient = require("midtrans-client");

class MidtransService {
  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === "production",
      serverKey: process.env.MIDTRANS_SERVER_KEY, // Ambil dari .env
      clientKey: process.env.MIDTRANS_CLIENT_KEY, // Anda perlu ini di frontend
    });
  }

  /**
   * @param {object} transaction - Objek transaksi Sequelize
   * @param {object} user - Objek user Sequelize
   * @param {array} itemDetails - Array item_details untuk Midtrans
   */
  async createToken(transaction, user, itemDetails) {
    const parameter = {
      transaction_details: {
        order_id: transaction.order_id_display, // Wajib unik
        gross_amount: parseFloat(transaction.grand_total),
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.phone_number,
      },
      item_details: itemDetails,
    };

    try {
      const snapToken = await this.snap.createTransactionToken(parameter);
      return snapToken;
    } catch (e) {
      throw new Error(`Midtrans Error: ${e.message}`);
    }
  }
}

// --- ⬇️ PERBAIKAN PENTING ADA DI SINI ⬇️ ---
// Kita ekspor CLASS-nya, bukan instance-nya
module.exports = MidtransService;
// --- ⬆️ AKHIR PERBAIKAN ⬆️ ---
