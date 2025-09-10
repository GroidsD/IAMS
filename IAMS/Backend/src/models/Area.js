"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Area.init(
    {
      areaId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      areaName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Area",
      tableName: "Areas",
      freezeTableName: true,
    }
  );

  return Area;
};
