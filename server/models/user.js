// models/user.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      User.hasMany(models.Transaction, {
        foreignKey: "user_id",
        as: "transactions",
      });;
     User.hasOne(models.Address, {
       // 'Address' (singular)
       foreignKey: "user_id",
       as: "address", // 'address' (singular)
     });
      User.hasMany(models.Carts, {
        foreignKey: "user_id",
        as: "cart_items",
      });
    }
  }

  User.init(
    {
      // Ini adalah definisi kolom, harus cocok dengan migrasi
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "customer", "staff"),
        allowNull: false,
        defaultValue: "customer",
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verification_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      // Kita tidak perlu 'createdAt' & 'updatedAt' di sini
      // karena migrasi kita sudah setting 'defaultValue' di level DB.
      // Sequelize akan otomatis mengenali kolom-kolom itu.
    }
  );

  return User;
};
