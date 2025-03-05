const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserGroups extends Model {
        static associate(models) {
            UserGroups.belongsTo(models.Users, { foreignKey: 'userId' });
            UserGroups.belongsTo(models.Groups, { foreignKey: 'groupsId' });
        }
    }

    UserGroups.init(
        {
            groupsId: { type: DataTypes.INTEGER, allowNull: false},
            userId: { type: DataTypes.INTEGER, allowNull: false},

        },

        { sequelize, modelName: 'UserGroups',
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'groupsId']
                }
            ] },

    );

    return UserGroups;
};
