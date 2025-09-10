"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuditAuditor extends Model {
    static associate(models) {}
  }
  AuditAuditor.init(
    {
      auditId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      auditorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "AuditAuditor",
      tableName: "AuditAuditors",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return AuditAuditor;
};
