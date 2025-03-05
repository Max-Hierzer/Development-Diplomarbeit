// models/users.js
const { Model, DataTypes } = require('sequelize');

// define users
module.exports = (sequelize, DataTypes) => {
    class Groups extends Model {
        static associate(models) {
            Groups.hasMany(models.UserGroups, { foreignKey: 'groupId' });    // 1 user has many UserAnswers
            Groups.hasMany(models.PollGroups, { foreignKey: 'groupId' });
        }
    }
    // define attributes
    Groups.init(
        {
            name: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: true}
        },
        { sequelize, modelName: 'Groups' }
    );

    return Groups;
};
