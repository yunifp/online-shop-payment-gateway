// controllers/authController.js
const authService = require("../services/authService");
const { User } = require('../models');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      };
      res.cookie("token", token, cookieOptions);

      // --- PASTIKAN KAMU MENGGUNAKAN res.success() DI SINI ---
      // BUKAN res.status(200).json(...)
      res.success({ user: user}, "Login successful", 200);
      // ----------------------------------------------------
    } catch (error) {
      // --- DAN res.error() DI SINI ---
      res.error(error.message, 401);
      // -------------------------------
    }
  }
  // --- TAMBAHKAN FUNGSI INI ---
  async logout(req, res) {
    try {
      // Opsi cookie untuk "menghapus"
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0, // PENTING: Set masa berlaku ke 0
      };

      // Tanam cookie kosong dengan masa berlaku 0
      res.cookie("token", "", cookieOptions);

      // Kirim respons sukses
      res.success(null, "Logout successful", 200);
    } catch (error) {
      res.error(error.message, 500);
    }
  }
  async verifyEmail(req, res) {
    try {
      // 1. Ambil OTP dari body
      const { otp } = req.body;

      // 2. Ambil EMAIL dari TOKEN (req.user)
      const { email } = req.user;

      // 3. Panggil service
      // Service akan mengembalikan token baru (refresh token)
      const { token, user } = await authService.verifyEmail(email, otp);

      // 4. Atur cookie dengan token BARU (is_verified: true)
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      };
      res.cookie("token", token, cookieOptions);

      // 5. Kembalikan data user yang sudah terverifikasi
      res.success(
        { user: user },
        "Verification successful. Token refreshed.",
        200
      );
    } catch (error) {
      res.error(error.message, 400);
    }
  }

  async resendVerification(req, res) {
    try {
      // 1. Ambil EMAIL dari TOKEN (req.user)
      const { email } = req.user;

      if (!email) {
        return res.error("User not identified", 401);
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.error("User not found", 404);
      }
      if (user.is_email_verified) {
        return res.error("Email is already verified", 400);
      }

      await authService.sendVerificationEmail(user); //
      res.success(null, "Verification email sent", 200);
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  // --- INI FUNGSI YANG HILANG ---
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);

      // Selalu kirim respons sukses untuk keamanan
      res.success(
        null,
        "If your email is registered, you will receive a password reset link.",
        200
      );
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  // --- INI FUNGSI YANG HILANG ---
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);

      res.success(result, result.message, 200);
    } catch (error) {
      res.error(error.message, 400);
    }
  }
}

module.exports = new AuthController();
