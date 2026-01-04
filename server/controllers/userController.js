// controllers/userController.js
const userService = require("../services/userService");
const authService = require("../services/authService");

class UserController {
  // Create
  async createUser(req, res) {
    try {
      // Lempar 'req.user' dari middleware ke service
      const user = await userService.createUser(req.body, req.user);
      res.success(user, "User created successfully", 201);
    } catch (error) {
      // Jika error 'Forbidden', kirim 403
      if (error.message.startsWith("Forbidden:")) {
        return res.error(error.message, 403);
      }
      res.error(error.message, 400);
    }
  }
  async registerCustomer(req, res) {
    try {
      // 1. Buat user & kirim email (seperti sebelumnya)
      // 'user' yang dikembalikan di sini sudah di-delete password-nya
      const user = await userService.registerCustomer(req.body);

      // 2. Buat token untuk user baru (AUTO-LOGIN)
      const token = authService.generateTokenForUser(user);

      // 3. Atur cookie (salin dari authController.login)
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
      };
      res.cookie("token", token, cookieOptions);

      // 4. Kirim respons sukses (sekarang mirip login)
      res.success(
        { user: user }, // Kirim data user
        "Registration successful. Logged in. Please verify your email.",
        201
      );
    } catch (error) {
      res.error(error.message, 400);
    }
  }
  async getAdminStaff(req, res) {
    try {
      const users = await userService.getAdminAndStaff();
      res.success(users, "Admin and Staff users retrieved");
    } catch (error) {
      res.error(error.message, 500);
    }
  }

  // --- TAMBAHKAN FUNGSI BARU 2 ---
  async getCustomers(req, res) {
    try {
      const users = await userService.getCustomers();
      res.success(users, "Customer users retrieved");
    } catch (error) {
      res.error(error.message, 500);
    }
  }
  // Read (One)
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.success(user, "User retrieved successfully");
    } catch (error) {
      res.error(error.message, 404); // 404 Not Found
    }
  }
  async getMe(req, res) {
    try {
      // 1. Ambil ID dari 'req.user' (yang diisi oleh middleware 'authenticate')
      //    BUKAN dari 'req.params.id'
      const userId = req.user.id;

      // 2. Panggil service yang sudah ada
      const user = await userService.getUserById(userId);

      if (!user) {
        // Ini jarang terjadi, tapi untuk jaga-jaga
        return res.error("User not found from token", 404);
      }

      res.success(user, "Profile retrieved successfully");
    } catch (error) {
      res.error(error.message, 500);
    }
  }
  // Update
  async updateMyProfile(req, res) {
    try {
      // Ambil ID dari token (req.user set oleh middleware authenticate)
      const userId = req.user.id;

      // Reuse logic update, tapi paksa ID-nya pakai ID sendiri
      // Pastikan service Anda menerima (id, data)
      const updatedUser = await userService.updateUser(userId, req.body);

      res.success(updatedUser, "Profil Anda berhasil diperbarui");
    } catch (error) {
      res.error(error.message, 400);
    }
  }
  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.success(user, "User updated successfully");
    } catch (error) {
      res.error(error.message, 400); // 400 Bad Request
    }
  }

  // Delete
  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      // Kita bisa kirim data null
      res.success(null, "User deleted successfully");
    } catch (error) {
      res.error(error.message, 404); // 404 Not Found
    }
  }
}

module.exports = new UserController();
