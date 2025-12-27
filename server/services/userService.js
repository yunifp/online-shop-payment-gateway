
// services/userService.js
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { User } = require("../models");
const authService = require("./authService");

class UserService {
  async createUser(userData, creator) {
    const { email, password, name, role } = userData;

    if (!email || !password || !name) {
      throw new Error("Email, password, and name are required");
    }

    const roleToCreate = role || "customer";
    if (
      creator &&
      creator.role === "staff" &&
      (roleToCreate === "admin" || roleToCreate === "staff")
    ) {
      throw new Error("Forbidden: Staff cannot create admin or staff accounts");
    }

    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
      role: roleToCreate,
      is_email_verified: true,
    });

    delete newUser.dataValues.password;
    return newUser;
  }

  async registerCustomer(userData) {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      is_email_verified: false,
    });
    await authService.sendVerificationEmail(newUser);
    delete newUser.dataValues.password;
    return newUser;
  }

  async getAdminAndStaff() {
    return await userRepository.getAllUsers({
      where: {
        role: {
          [Op.in]: ["admin", "staff"],
        },
      },
    });
  }
  async getCustomers() {
    return await userRepository.getAllUsers({
      where: {
        role: "customer",
      },
    });
  }

  async getUserById(id) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(id, userData) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    return await userRepository.updateUser(id, userData);
  }

  async deleteUser(id) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return await userRepository.deleteUser(id);
  }
}

module.exports = new UserService();
