// seeders/20250317-seed-group.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const group = await queryInterface.bulkInsert('Groups', [{
      name: 'Admin Group',
      description: 'This is a test group created by Seeder',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true });

    const groupId = group[0].id;

    await queryInterface.bulkInsert('UserGroups', [{
      groupId: groupId,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserGroups', null, {});
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
