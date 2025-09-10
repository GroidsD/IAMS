"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Audits", {
      auditId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      auditTitle: {
        type: Sequelize.STRING,
      },
      locationId: {
        type: Sequelize.INTEGER,
      },
      areaId: {
        type: Sequelize.INTEGER,
      },
      typeId: {
        type: Sequelize.INTEGER,
      },
      shiftId: {
        type: Sequelize.INTEGER,
      },
      dateAudit: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      auditeeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      checkListId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Planned", "Confirmed", "Reschedule", "Canceled"),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Audits");
  },
};
