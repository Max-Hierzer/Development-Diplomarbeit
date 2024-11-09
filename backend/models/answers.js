const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Answers extends Model {
        static associate(models) {
            // Define associations
            Answers.hasMany(models.UserAnswers, { foreignKey: 'answerId' });
            Answers.belongsToMany(models.Questions, { through: 'QuestionAnswers' });
        }
    }

    Answers.init(
        {
            name: { type: DataTypes.STRING, allowNull: false }
        },
        { sequelize, modelName: 'Answers' }
    );

    return Answers
}
