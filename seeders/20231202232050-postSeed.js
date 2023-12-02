'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Posts', [
      {
      id: '1',
      userId: '1',
      category: 'comedy',
      createdAt: new Date(),
      updatedAt: new Date()
    },
      {
      id: '2',
      userId: '2',
      category: 'tea',
      createdAt: new Date(),
      updatedAt: new Date()
    },
      
  ], {})

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Posts', null, {}) 
  }
};
