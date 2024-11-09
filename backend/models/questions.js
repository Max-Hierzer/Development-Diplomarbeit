const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Questions extends Model {
        static associate(models) {
            // Define associations
            Questions.hasMany(models.UserAnswers, { foreignKey: 'answerId' });
            Questions.belongsToMany(models.Answers, { through: 'QuestionAnswers' });
            Questions.belongsTo(models.Polls, { foreignKey: 'pollId' });
        }
    }

    Questions.init(
        {
            name: { type: DataTypes.STRING, allowNull: false }
        },
        { sequelize, modelName: 'Questions' }
    );

    return Questions
}
