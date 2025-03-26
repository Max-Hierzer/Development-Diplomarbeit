const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class QuestionTypes extends Model {
        static associate(models) { // define relations
            QuestionTypes.hasMany(models.Questions, { foreignKey: 'typeId' });
            QuestionTypes.hasMany(models.PublicQuestions, { foreignKey: 'typeId' });
        }
    }

    QuestionTypes.init(
        {
            name: { type: DataTypes.STRING, allowNull: false }
        },
        { sequelize, modelName: 'QuestionTypes' }
    );

    return QuestionTypes;
};
