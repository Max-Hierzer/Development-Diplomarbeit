// models/userAnswers.js
const { Model, DataTypes } = require('sequelize');

// define UserAnswers
module.exports = (sequelize) => {
    class PollGroups extends Model {
        static associate(models) {
            PollGroups.belongsTo(models.Polls, { foreignKey: 'pollId' });
            PollGroups.belongsTo(models.Groups, { foreignKey: 'groupsId' });
        }
    }

    PollGroups.init(
        {
            groupsId: { type: DataTypes.INTEGER, allowNull: false},
            pollId: { type: DataTypes.INTEGER, allowNull: false},

        },

        { sequelize, modelName: 'PollGroups',
            indexes: [
            {
                unique: true,
                fields: ['groupsId', 'pollId']
            }
        ] },

    );

    return PollGroups;
};
