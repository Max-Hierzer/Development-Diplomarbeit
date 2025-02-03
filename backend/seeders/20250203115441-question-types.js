'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('QuestionTypes', [
      {
        id: 1,
        name: 'Single Choice',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Multiple Choice',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Weighted Choice',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('QuestionTypes', null, {});
  }
};
