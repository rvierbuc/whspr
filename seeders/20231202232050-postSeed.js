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
      soundId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
      {
      id: '2',
      userId: '2',
      category: 'tea',
      soundId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      userId: '3',
      category: 'music',
      soundId: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      userId: '3',
      category: 'comedy',
      soundId: '4',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      userId: '2',
      category: 'music',
      soundId: '5',
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
