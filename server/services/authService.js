// services/authService.js
const userRepository = require("../repositories/userRepository");
const emailService = require("./emailService"); // <-- Ini BENAR
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");
const { Op } = require("sequelize");

class AuthService {
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Panggil repository dan MINTA password-nya
    const user = await userRepository.getUserByEmail(email, true);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      is_email_verified: user.is_email_verified,
    };

    const token = this.generateTokenForUser(user);

    // PENTING: Hapus password dari objek user SEBELUM dikembalikan
    delete user.dataValues.password;

    // Kembalikan token DAN data user
    return { token, user };
  }
  /**
   * Membuat token JWT untuk user yang sudah ada.
   * @param {object} user - Objek user dari Sequelize
   * @returns {string} - Token JWT
   */
  generateTokenForUser(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      is_email_verified: user.is_email_verified,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return token;
  }
async verifyEmail(email, submittedOtp) {
    if (!email || !submittedOtp) {
      throw new Error("Email and OTP are required");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.is_email_verified) {
      // Jika user iseng kirim ulang padahal sudah verified, kita tetap kasih token login
      const token = this.generateTokenForUser(user);
      return { token, message: "Email is already verified" };
    }

    // Cek Token/OTP
    if (!user.verification_token || !user.verification_expires) {
      throw new Error("Invalid verification request. Please resend OTP.");
    }

    if (new Date() > new Date(user.verification_expires)) {
      throw new Error("OTP has expired. Please resend.");
    }

    const isMatch = await bcrypt.compare(submittedOtp, user.verification_token);
    if (!isMatch) {
      throw new Error("Invalid OTP");
    }

    // Update Status User
    await user.update({
      is_email_verified: true,
      verification_token: null,
      verification_expires: null,
    });

    // --- PERBAIKAN DI SINI: GENERATE TOKEN BARU ---
    // Agar setelah verifikasi, user langsung punya "Tiket Masuk" yang valid
    const token = this.generateTokenForUser(user);

    return { token, message: "Email verification successful." };
  }
  async forgotPassword(email) {
    if (!email) {
      throw new Error("Email is required");
    }

    const user = await User.findOne({ where: { email } });

    // PENTING: Jangan beri tahu jika email tidak ada
    // Ini untuk mencegah 'user enumeration attack'
    if (!user) {
      return;
    }

    // 1. Buat token acak (bukan OTP)
    const token = crypto.randomBytes(32).toString("hex");

    // 2. Hash token ini untuk disimpan di DB (SANGAT AMAN)
    // Kita pakai sha256, bukan bcrypt, agar bisa dicari
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 3. Set kedaluwarsa (1 jam)
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // 4. Simpan hash & expires ke user
    await user.update({
      verification_token: hashedToken,
      verification_expires: expires,
    });

    // 5. Kirim email (yang berisi token PLAIN TEXT)
    await emailService.sendPasswordResetEmail(user.email, token);
  }

  // --- FUNGSI BARU 2: RESET PASSWORD ---
  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error("Token and new password are required");
    }

    // 1. Hash token yang masuk untuk dicari di DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Cari user berdasarkan hash DAN belum kedaluwarsa
    const user = await User.findOne({
      where: {
        verification_token: hashedToken,
        verification_expires: { [Op.gt]: new Date() }, // Cek jika > dari 'sekarang'
      },
    });

    // 3. Jika token tidak valid atau expired
    if (!user) {
      throw new Error("Invalid or expired password reset token");
    }

    // 4. Sukses! Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Update password & bersihkan token
    await user.update({
      password: hashedPassword,
      verification_token: null,
      verification_expires: null,
    });

    return { message: "Password reset successfully" };
  }
  async sendVerificationEmail(user) {
    // 1. Buat OTP 6 digit
    const otp = crypto.randomInt(100000, 999999).toString();

    // 2. Set kedaluwarsa (10 menit)
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // 3. Hash OTP untuk disimpan di DB
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // 4. SIMPAN hash dan kedaluwarsa ke database (INI YANG HILANG)
    await user.update({
      verification_token: hashedOtp,
      verification_expires: expires,
    });

    // 5. KIRIM email (yang berisi OTP plain text) (INI YANG HILANG)
    await emailService.sendVerificationEmail(user.email, otp);
  }
}

module.exports = new AuthService();
