"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // ============================================================
    // 1. Tabel PROVINCES
    // ============================================================
    await queryInterface.createTable("provinces", {
      province_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Kolom untuk menyimpan JSON mentah dari RajaOngkir
      data: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // ============================================================
    // 2. Tabel CITIES (Kota/Kabupaten)
    // ============================================================
    await queryInterface.createTable("cities", {
      city_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Parent ID: Untuk filter "Kota ini milik Provinsi mana?"
      province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // Tambahkan Index biar pencarian via province_id Cepat
    await queryInterface.addIndex("cities", ["province_id"]);

    // ============================================================
    // 3. Tabel DISTRICTS (Kecamatan)
    // ============================================================
    await queryInterface.createTable("districts", {
      district_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Parent ID: Untuk filter "Kecamatan ini milik Kota mana?"
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("districts", ["city_id"]);

    // ============================================================
    // 4. Tabel VILLAGES (Desa/Kelurahan)
    // ============================================================
    await queryInterface.createTable("villages", {
      village_id: {
        allowNull: false,
        primaryKey: true,
        // Gunakan BIGINT jaga-jaga jika ID desa formatnya panjang (lebih dari 10 digit)
        type: Sequelize.BIGINT,
      },
      // Parent ID: Untuk filter "Desa ini milik Kecamatan mana?"
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("villages", ["district_id"]);
  },

  async down(queryInterface, Sequelize) {
    // Hapus urutan dari bawah ke atas (Anak dulu baru Induk)
    await queryInterface.dropTable("villages");
    await queryInterface.dropTable("districts");
    await queryInterface.dropTable("cities");
    await queryInterface.dropTable("provinces");
  },
};
