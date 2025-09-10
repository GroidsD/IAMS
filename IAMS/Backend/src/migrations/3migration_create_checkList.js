"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CheckLists", {
      checkListId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      checkListTitle: {
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
      checkListFile: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CheckLists");
  },
};
