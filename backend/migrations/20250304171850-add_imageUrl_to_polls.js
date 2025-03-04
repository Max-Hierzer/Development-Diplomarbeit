'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Polls', 'imageUrl', {
          type: Sequelize.STRING,
          allowNull: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Polls', 'imageUrl');
  }
};
