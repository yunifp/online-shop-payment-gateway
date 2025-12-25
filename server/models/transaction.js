// server/models/transaction.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Transaction.hasMany(models.TransactionDetail, {
        foreignKey: "transaction_id",
        as: "details",
      });
    }
  }

  Transaction.init(
    {
      // Sesuaikan persis dengan migrasi Anda
      order_id_display: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      user_id: { type: DataTypes.INTEGER, allowNull: true },
      total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      shipping_cost: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      discount_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      service_fee: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      grand_total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      shipping_address: { type: DataTypes.TEXT, allowNull: false },
      courier: { type: DataTypes.STRING, allowNull: false },
      shipping_service: { type: DataTypes.STRING, allowNull: false },
      shipping_receipt_number: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "paid",
          "processing",
          "shipped",
          "completed",
          "failed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      midtrans_token: { type: DataTypes.STRING, allowNull: false },
      payment_method: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "Transactions",
    }
  );
  return Transaction;
};
