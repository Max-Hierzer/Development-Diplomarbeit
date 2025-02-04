'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin', saltRounds);

    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
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
