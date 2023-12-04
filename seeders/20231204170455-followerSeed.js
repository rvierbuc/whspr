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
    await queryInterface.bulkInsert('Followers', [
      {
      id: '1',
      userId: '1',
      followingId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      userId: '1',
      followingId: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
      {
      id: '3',
      userId: '2',
      followingId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      userId: '2',
      followingId: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Followers', null, {}) 
  }
};
