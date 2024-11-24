'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'roleId', {
            type: Sequelize.INTEGER,
            allowNull: false, // Default NOT NULL
            defaultValue: 3, // Ensure existing rows get a default role
            references: {
                model: 'UserRoles',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'NO ACTION'
        });
    },

    down: async (queryInterface, Sequelize) => {
      // Remove the `roleId` column
        await queryInterface.removeColumn('Users', 'roleId');
    }
};
