const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserGroups extends Model {
        static associate(models) {
            UserGroups.belongsTo(models.Users, { foreignKey: 'userId' });
            UserGroups.belongsTo(models.Groups, { foreignKey: 'groupId' });
        }
    }

    UserGroups.init(
        {
            groupId: { type: DataTypes.INTEGER, allowNull: false},
            userId: { type: DataTypes.INTEGER, allowNull: false},

        },

        { sequelize, modelName: 'UserGroups',
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'groupId']
                }
            ] },

    );

    return UserGroups;
};
