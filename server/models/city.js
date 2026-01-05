module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define(
    "City",
    {
      city_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "cities",
      timestamps: false,
    }
  );

  return City;
};
