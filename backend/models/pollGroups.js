const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class PollGroups extends Model {
        static associate(models) {
            PollGroups.belongsTo(models.Polls, { foreignKey: 'pollId' });
            PollGroups.belongsTo(models.Groups, { foreignKey: 'groupId' });
        }
    }

    PollGroups.init(
        {
            groupId: { type: DataTypes.INTEGER, allowNull: false},
            pollId: { type: DataTypes.INTEGER, allowNull: false},

        },

        { sequelize, modelName: 'PollGroups',
            indexes: [
            {
                unique: true,
                fields: ['groupId', 'pollId']
            }
        ] },

    );

    return PollGroups;
};
