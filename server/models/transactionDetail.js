// server/models/transactionDetail.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    static associate(models) {
      TransactionDetail.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        as: "transaction",
      });
      // Gunakan nama model yang benar 'Products_Variant'
      TransactionDetail.belongsTo(models.Products_Variant, {
        foreignKey: "variant_id",
        as: "product_variant",
      });
    }
  }

  TransactionDetail.init(
    {
      // Sesuai migrasi
      transaction_id: { type: DataTypes.INTEGER, allowNull: false },
      variant_id: { type: DataTypes.INTEGER, allowNull: true },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price_at_purchase: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      weight_at_purchase_grams: { type: DataTypes.INTEGER, allowNull: false },
      product_snapshot: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: "TransactionDetail",
      tableName: "Transaction_Details", // Sesuaikan dengan nama tabel di migrasi
    }
  );
  return TransactionDetail;
};
