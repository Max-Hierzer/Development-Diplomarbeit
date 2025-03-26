// models/answers.js
const { Model, DataTypes } = require('sequelize');

// creates table Answers
module.exports = (sequelize) => {
    class PublicAnswers extends Model {
        static associate(models) {                                                      // define relations
            PublicAnswers.hasMany(models.PublicUserData, { foreignKey: 'publicAnswerId' });            // 1 Answer has many UserAnswers
            PublicAnswers.belongsToMany(models.PublicQuestions, { through: 'PublicQuestionAnswers' });    // many Answers have many Questions
        }
    }
    // attributes of Answers
    PublicAnswers.init(
        {
            name: { type: DataTypes.STRING(1000), allowNull: false }
        },
        { sequelize, modelName: 'PublicAnswers' }
    );

    return PublicAnswers
}
