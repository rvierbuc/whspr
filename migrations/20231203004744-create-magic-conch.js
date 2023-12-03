'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MagicConches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sendingUserId: {
        type: Sequelize.INTEGER
      },
      receivingUserId: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      audioId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MagicConches');
  }
};