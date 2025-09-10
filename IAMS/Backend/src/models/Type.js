"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Type.init(
    {
      typeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      typeName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Type",
      tableName: "Types",
      freezeTableName: true,
    }
  );

  return Type;
};
