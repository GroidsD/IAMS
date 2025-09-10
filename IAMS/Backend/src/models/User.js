"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Audit, {
        through: models.AuditAuditor,
        foreignKey: "auditorId",
        otherKey: "auditId",
        as: "auditsAsAuditor",
      });

      // Existing association for Auditees
      User.hasMany(models.Audit, {
        foreignKey: "auditeeId",
        as: "auditsAsAuditee",
      });
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM("admin", "auditor", "auditee"),
        allowNull: false,
        defaultValue: "auditor",
      },
      department: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      freezeTableName: true,
    }
  );

  return User;
};
