module.exports = (sequelize, DataTypes) => {
  const SubDistrict = sequelize.define(
    "SubDistrict",
    {
      // UBAH: village_id -> sub_district_id
      sub_district_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      // UBAH: villages -> sub_districts
      tableName: "sub_districts",
      timestamps: false,
    }
  );

  return SubDistrict;
};
