// models/answers.js
const { Model, DataTypes } = require('sequelize');

// creates table Answers
module.exports = (sequelize) => {
    class Answers extends Model {
        static associate(models) {                                                      // define relations
            Answers.hasMany(models.UserAnswers, { foreignKey: 'answerId' });            // 1 Answer has many UserAnswers
            Answers.belongsToMany(models.Questions, { through: 'QuestionAnswers' });    // many Answers have many Questions
        }
    }
    // attributes of Answers
    Answers.init(
        {
            name: { type: DataTypes.STRING(1000), allowNull: false }
        },
        { sequelize, modelName: 'Answers' }
    );

    return Answers
}
