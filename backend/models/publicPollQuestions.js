const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class PublicPollQuestions extends Model {
        static associate(models) {
            PublicPollQuestions.belongsTo(models.Polls, { foreignKey: 'pollId' });
            PublicPollQuestions.belongsTo(models.PublicQuestions, { foreignKey: 'publicQuestionId' });
        }
    }

    PublicPollQuestions.init(
        {
            pollId: { type: DataTypes.INTEGER, allowNull: false},
            publicQuestionId: { type: DataTypes.INTEGER, allowNull: false},

        },

        { sequelize, modelName: 'PublicPollQuestions',
            indexes: [
                {
                    unique: true,
                    fields: ['pollId', 'publicQuestionId']
                }
            ] },

    );

    return PublicPollQuestions;
};
