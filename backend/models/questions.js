// models/questions.js
const { Model, DataTypes } = require('sequelize');

// define questions
module.exports = (sequelize) => {
    class Questions extends Model {
        static associate(models) { // define relations
            Questions.hasMany(models.UserAnswers, { foreignKey: 'answerId' });          // 1 Question has many UserAnswers
            Questions.belongsToMany(models.Answers, { through: 'QuestionAnswers' });    // Many Questions have many Answers
            Questions.belongsTo(models.QuestionTypes, { foreignKey: 'typeId', as: 'QuestionType' });
        }
    }
    // define attributes
    Questions.init(
        {
            name: { type: DataTypes.STRING, allowNull: false },
            pollId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Polls', key: 'id' } },
            typeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'QuestionTypes', key: 'id' } }
        },
        { sequelize, modelName: 'Questions' }
    );

    return Questions
}
