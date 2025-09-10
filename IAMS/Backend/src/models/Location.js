"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Location.init(
    {
      locationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      locationName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Location",
      tableName: "Locations",
      freezeTableName: true,
    }
  );

  return Location;
};
