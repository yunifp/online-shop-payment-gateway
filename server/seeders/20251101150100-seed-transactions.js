"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Data Snapshot Alamat (disalin dari data alamat di atas agar konsisten)
    const addressSnapshot = JSON.stringify({
      recipient_name: "Budi Santoso",
      recipient_phone: "081234567890",
      full_address: "Jl. Merdeka No. 45, RT 01/RW 02",
      province_name: "DKI Jakarta",
      city_name: "Jakarta Selatan",
      district_name: "Tebet",
      postal_code: "12810"
    });

    // 1. SEED TRANSACTIONS
    const transactionsData = [
      {
        id: 1, // Set ID 1
        order_id_display: "TRX-20251101-0001",
        user_id: 2, // User Customer
        total_price: 1700000.00, // (850k * 2)
        shipping_cost: 25000.00,
        discount_amount: 0.00,
        service_fee: 1000.00,
        grand_total: 1726000.00,
        shipping_address: addressSnapshot,
        courier: "jne",
        shipping_service: "REG",
        shipping_receipt_number: "JNE123456789",
        status: "shipped", // Status dikirim
        midtrans_token: "dummy-token-123",
        payment_method: "bca_va",
        createdAt: new Date("2025-11-01 10:00:00"),
        updatedAt: new Date("2025-11-01 12:00:00"),
      },
      {
        id: 2, // Set ID 2
        order_id_display: "TRX-20251102-0002",
        user_id: 2,
        total_price: 1200000.00,
        shipping_cost: 0.00,
        discount_amount: 50000.00,
        service_fee: 1000.00,
        grand_total: 1151000.00,
        shipping_address: addressSnapshot,
        courier: "sicepat",
        shipping_service: "GOKIL",
        shipping_receipt_number: null,
        status: "pending", // Status belum bayar
        midtrans_token: "dummy-token-456",
        payment_method: "gopay",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert("Transactions", transactionsData, {});

    // 2. SEED TRANSACTION DETAILS
    const transactionDetailsData = [
      // Detail untuk Transaksi 1 (Beli 2 Tenda)
      {
        transaction_id: 1,
        variant_id: 1, // Tenda Orange
        quantity: 1,
        price_at_purchase: 850000.00,
        weight_at_purchase_grams: 2500,
        product_snapshot: JSON.stringify({ name: "Tenda Camping Eiger Storm 2P", variant: "Orange" }),
        createdAt: new Date("2025-11-01 10:00:00"),
        updatedAt: new Date("2025-11-01 10:00:00"),
      },
      {
        transaction_id: 1,
        variant_id: 2, // Tenda Green
        quantity: 1,
        price_at_purchase: 850000.00,
        weight_at_purchase_grams: 2500,
        product_snapshot: JSON.stringify({ name: "Tenda Camping Eiger Storm 2P", variant: "Green" }),
        createdAt: new Date("2025-11-01 10:00:00"),
        updatedAt: new Date("2025-11-01 10:00:00"),
      },
      // Detail untuk Transaksi 2 (Beli 1 Tas)
      {
        transaction_id: 2,
        variant_id: 3, // Tas Carrier
        quantity: 1,
        price_at_purchase: 1200000.00,
        weight_at_purchase_grams: 1500,
        product_snapshot: JSON.stringify({ name: "Tas Gunung Carrier 60L", variant: "Black" }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Transaction_Details", transactionDetailsData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Transaction_Details", null, {});
    await queryInterface.bulkDelete("Transactions", null, {});
  },
};