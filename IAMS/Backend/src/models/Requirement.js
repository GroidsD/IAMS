"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Requirement extends Model {
    static associate(models) {
      // Mỗi Requirement thuộc về một Audit
      Requirement.belongsTo(models.Audit, {
        foreignKey: "auditId",
        as: "audit",
      });
    }
  }

  Requirement.init(
    {
      requirementId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      auditId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      compliancy: {
        type: DataTypes.ENUM("YES", "NO", "Not Applicable"),
        allowNull: true,
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      evidence: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Requirement",
      tableName: "Requirements",
      freezeTableName: true,
    }
  );

  return Requirement;
};
