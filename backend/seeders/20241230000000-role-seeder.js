// seeders/20241230000000-role-seeder.js

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'admin',
        description: 'Darf alle Funktionen im vollen umfang ausführen.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'poweruser',
        description: 'Darf Polls erstellen, bearbeiten, löschen und darauf abstimmen.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'normal',
        description: 'Darf normal abstimmen und sich Ergebnisse anzeigen lassen. ',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};