// models/polls.js
const { Model, DataTypes } = require('sequelize');

// defines polls
module.exports = (sequelize) => {
    class UserPolls extends Model {
        static associate(models) {  // define relations
            UserPolls.belongsTo(models.Polls, { foreignKey: 'pollId' }); // 1 poll has many questions
            UserPolls.belongsTo(models.Users, { foreignKey: 'userId' });
        }
    }

    // gives poll atributes
    UserPolls.init(
        {
            userId: { type: DataTypes.INTEGER, allowNull: false},
            pollId: { type: DataTypes.INTEGER, allowNull: false},
            hasVoted: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true}
        },
        {
            sequelize,
            modelName: 'UserPolls',
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'pollId']
                }
            ]
        },
    );
    UserPolls.removeAttribute("id")
    return UserPolls
}
