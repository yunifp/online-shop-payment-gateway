// server/services/whatsappService.js
const axios = require("axios");

class WhatsappService {
  constructor() {
    // Sebaiknya simpan token di environment variable
    this.token = process.env.FONNTE_TOKEN;
  }

  /**
   * Membersihkan nomor HP agar sesuai format Fonnte/WA (628...)
   */
  _sanitizePhoneNumber(phone) {
    if (!phone) return null;
    let sanitized = phone.trim().replace(/[^0-9]/g, ""); // Hapus karakter non-angka

    if (sanitized.startsWith("08")) {
      sanitized = "62" + sanitized.slice(1);
    } else if (sanitized.startsWith("8")) {
      sanitized = "62" + sanitized;
    }
    // Jika sudah 628..., biarkan.
    return sanitized;
  }

  async sendMessage(target, message) {
    const phone = this._sanitizePhoneNumber(target);
    if (!phone) {
      console.warn("WhatsappService: Nomor telepon tidak valid/kosong.");
      return false;
    }

    try {
      const response = await axios.post(
        "https://api.fonnte.com/send",
        {
          target: phone,
          message: message,
          countryCode: "62", // Opsional
        },
        {
          headers: {
            Authorization: this.token,
          },
        }
      );

      console.log(
        `WhatsappService: Pesan terkirim ke ${phone}. Status:`,
        response.data.status
      );
      return true;
    } catch (error) {
      // Kita hanya log error, jangan sampai melempar throw agar transaksi tidak batal
      console.error("WhatsappService Error:", error.message);
      return false;
    }
  }
}

module.exports = new WhatsappService();
