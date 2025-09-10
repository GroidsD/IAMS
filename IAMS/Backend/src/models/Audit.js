"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Audit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Audit.belongsTo(models.User, {
        foreignKey: "auditeeId",
        targetKey: "userId",
        as: "auditee",
      });
      Audit.belongsTo(models.CheckList, {
        foreignKey: "checkListId",
        as: "checkList",
      });

      Audit.belongsToMany(models.User, {
        through: models.AuditAuditor,
        foreignKey: "auditId",
        otherKey: "auditorId",
        as: "auditors",
      });
      Audit.belongsTo(models.Area, {
        foreignKey: "areaId",
        as: "auditArea",
      });
      Audit.belongsTo(models.Shift, {
        foreignKey: "shiftId",
        as: "auditShift",
      });
      Audit.belongsTo(models.Location, {
        foreignKey: "locationId",
        as: "auditLocation",
      });
      Audit.belongsTo(models.Type, {
        foreignKey: "typeId",
        as: "auditType",
      });
      Audit.hasMany(models.Requirement, {
        foreignKey: "auditId",
        as: "requirements", // Quan trọng: Đây là tên bạn sẽ dùng trong `include`
      });
    }
  }
  Audit.init(
    {
      auditId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      auditTitle: DataTypes.STRING,
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
      shiftId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dateAudit: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      auditeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      checkListId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Planned", "Confirmed", "Reschedule", "Canceled"],
        defaultValue: "Planned",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Audit",
      tableName: "Audits",
      freezeTableName: true,
    }
  );

  return Audit;
};
