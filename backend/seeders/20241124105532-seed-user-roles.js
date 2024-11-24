'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('UserRoles', [
            { 
                roleName: 'Admin',
                description: 'Administrator role with full access',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            { 
                roleName: 'Superuser',
                description: 'Role with elevated privileges',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            { 
                roleName: 'Normal',
                description: 'Standard user with basic permissions',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('UserRoles', null, {});
    }
};