const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Groups extends Model {
        static associate(models) {
            Groups.hasMany(models.UserGroups, { foreignKey: 'groupId' });
            Groups.hasMany(models.PollGroups, { foreignKey: 'groupId' });
        }
    }
    Groups.init(
        {
            name: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: true}
        },
        { sequelize, modelName: 'Groups' }
    );

    return Groups;
};
