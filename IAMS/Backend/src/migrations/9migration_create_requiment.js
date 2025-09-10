"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Requirements", {
      requirementId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      auditId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Audits",
          key: "auditId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      question: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      compliancy: {
        type: Sequelize.ENUM("YES", "NO", "Not Applicable"),
        allowNull: true,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      evidence: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Requirements");
  },
};
