// middleware/isVerified.js
const jwt = require("jsonwebtoken");
// Middleware ini harus dijalankan SETELAH 'authenticate.js'
const isVerified = (req, res, next) => {
  // Kita anggap 'authenticate' sudah berjalan dan mengisi 'req.user'
  if (!req.user || !req.user.is_email_verified) {
    return res.error(
      "Your email is not verified. Please verify your email first.",
      403 // 403 Forbidden
    );
  }

  // Jika sudah terverifikasi, lanjutkan
  next();
};

module.exports = isVerified;
