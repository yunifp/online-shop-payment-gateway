module.exports = (sequelize, DataTypes) => {
  const Village = sequelize.define(
    "Village",
    {
      village_id: {
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
      tableName: "villages",
      timestamps: false,
    }
  );

  return Village;
};
