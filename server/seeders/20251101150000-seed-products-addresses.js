"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. SEED PRODUCTS
    // Asumsi: Category ID 1 & 2 sudah ada dari seeder categories
    const productsData = [
      {
        id: 1, // Kita set ID eksplisit agar mudah direferensi di varian
        category_id: 1, 
        name: "Tenda Camping Eiger Storm 2P",
        slug: "tenda-camping-eiger-storm-2p",
        description: "Tenda kapasitas 2 orang, tahan badai dan hujan deras.",
        weight_grams: 2500,
        is_featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        category_id: 2, 
        name: "Tas Gunung Carrier 60L",
        slug: "tas-gunung-carrier-60l",
        description: "Tas carrier nyaman dengan backsystem jaring.",
        weight_grams: 1500,
        is_featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Products", productsData, {});

    // 2. SEED PRODUCT VARIANTS
    const variantsData = [
      {
        id: 1,
        product_id: 1, // Milik Tenda
        color: "Orange",
        size: "All Size",
        price: 850000.00,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        product_id: 1, // Milik Tenda
        color: "Green",
        size: "All Size",
        price: 850000.00,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        product_id: 2, // Milik Tas
        color: "Black",
        size: "60L",
        price: 1200000.00,
        stock: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Products_Variants", variantsData, {});

    // 3. SEED ADDRESSES
    // Asumsi: User ID 2 adalah customer
    const addressesData = [
      {
        user_id: 2, 
        recipient_name: "Budi Santoso",
        recipient_phone: "081234567890",
        full_address: "Jl. Merdeka No. 45, RT 01/RW 02",
        province_id: 6, // DKI Jakarta (contoh ID RajaOngkir)
        province_name: "DKI Jakarta",
        city_id: 153, // Jakarta Selatan (contoh ID RajaOngkir)
        city_name: "Jakarta Selatan",
        district_id: 2001, // Kecamatan Tebet (Dummy ID)
        district_name: "Tebet",
        postal_code: "12810",
        is_default: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Addresses", addressesData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Addresses", null, {});
    await queryInterface.bulkDelete("Products_Variants", null, {});
    await queryInterface.bulkDelete("Products", null, {});
  },
};