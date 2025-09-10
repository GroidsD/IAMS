// Tên file migration ví dụ: 2023xxxxxx-create-audit-auditor.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AuditAuditors", {
      auditId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Audits",
          key: "auditId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      auditorId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Users",
          key: "userId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // Có thể thêm createdAt và updatedAt nếu cần, nhưng thường thì không
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AuditAuditors");
  },
};
