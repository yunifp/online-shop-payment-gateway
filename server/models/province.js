module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define(
    "Province",
    {
      province_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "provinces",
      timestamps: false,
    }
  );

  return Province;
};
