// server/models/address.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mendefinisikan relasi 'many-to-one'
      // Satu alamat hanya dimiliki oleh satu user
      Address.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  Address.init(
    {
      // --- Ini adalah definisi yang BENAR sesuai migrasi baru Anda ---
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      recipient_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recipient_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      province_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      district_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "Addresses", // Pastikan nama tabel cocok
    }
  );

  return Address;
};
