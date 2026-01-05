module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define(
    "District",
    {
      district_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "districts",
      timestamps: false,
    }
  );

  return District;
};
