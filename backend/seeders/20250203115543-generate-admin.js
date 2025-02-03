'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'admin',
        email: 'admin@gmail.com',
        password: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId: 1
      }
    ], {});
  },
  
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@gmail.com'}, {});
  }
};
