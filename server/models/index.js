"use strict";

const fs = require("fs");
const path = require("path"); // <-- 1. IMPORT MODULE PATH
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// --- INI BAGIAN YANG DIPERBAIKI ---
// Menggunakan path.join() agar aman di semua OS (Windows, Mac, Linux)
const configPath = path.join(__dirname, "..", "config", "config.js");
const config = require(configPath)[env];
// --- SELESAI PERBAIKAN ---
config.timezone = "+07:00"; // Paksa Offset Query +7
config.dialectOptions = config.dialectOptions || {};
Object.assign(config.dialectOptions, {
  timezone: "+07:00", // Set koneksi MySQL ke +7
  dateStrings: true, // BACA tanggal sebagai string mentah ( "2024-01-01 13:00" )
  typeCast: true, // Wajib true agar dateStrings jalan
});
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
