const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserPolls extends Model {
        static associate(models) {
            UserPolls.belongsTo(models.Polls, { foreignKey: 'pollId' });
            UserPolls.belongsTo(models.Users, { foreignKey: 'userId' });
        }
    }

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
