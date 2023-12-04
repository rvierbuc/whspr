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
    await queryInterface.bulkInsert('Sounds', [
      {
      id: '1',
      postId: '1',
      title: 'super cool sound',
      recordingUrl: 'path/to/audio1',
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
        id: '2',
        postId: '2',
        title: 'funny story',
        recordingUrl: 'path/to/audio2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        postId: '3',
        title: 'super cool music',
        recordingUrl: 'path/to/audio3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        postId: '4',
        title: '30 sec of stand up',
        recordingUrl: 'path/to/audio4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        postId: '5',
        title: 'groovy tunes',
        recordingUrl: 'path/to/audio5',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Sounds', null, {}) 
  }
};
