const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class PublicQuestions extends Model {
        static associate(models) { // define relations
            PublicQuestions.hasMany(models.PublicUserData, { foreignKey: 'publicQuestionId' });          // 1 Question has many UserAnswers
            PublicQuestions.belongsToMany(models.PublicAnswers, { through: 'PublicQuestionAnswers' });    // Many Questions have many Answers
            PublicQuestions.belongsTo(models.QuestionTypes, { foreignKey: 'typeId', as: 'QuestionType' });
            PublicQuestions.hasMany(models.PublicPollQuestions, { foreignKey: 'publicQuestionId' });

        }
    }
    const restrictedTypeIds = [3];

    // Define attributes with validation
    PublicQuestions.init(
        {
            name: { type: DataTypes.STRING(1000), allowNull: false },
                         typeId: {
                             type: DataTypes.INTEGER,
                             allowNull: false,
                             references: { model: 'QuestionTypes', key: 'id' },
                             validate: {
                                 notRestricted(value) {
                                     if (restrictedTypeIds.includes(value)) {
                                         throw new Error(`Invalid question type: ${value}`);
                                     }
                                 }
                             }
                         }
        },
        { sequelize, modelName: 'PublicQuestions' }
    );
    return PublicQuestions
}
