"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CheckList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CheckList.belongsTo(models.Area, {
        foreignKey: "areaId",
        as: "area",
      });
      CheckList.belongsTo(models.Location, {
        foreignKey: "locationId",
        as: "location",
      });
      CheckList.belongsTo(models.Type, {
        foreignKey: "typeId",
        as: "type",
      });
    }
  }
  CheckList.init(
    {
      checkListId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      checkListTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      areaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      checkListFile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CheckList",
      tableName: "CheckLists",
      freezeTableName: true,
    }
  );

  return CheckList;
};
