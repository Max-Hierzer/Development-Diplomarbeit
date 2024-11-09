const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserAnswers extends Model {
        static associate(models) {
            // Define associations
            UserAnswers.belongsTo(models.Users, { foreignKey: 'userId' });
            UserAnswers.belongsTo(models.Answers, { foreignKey: 'answerId' });
            UserAnswers.belongsTo(models.Questions, { foreignKey: 'questionId' });
        }
    }

    UserAnswers.init(
        {
            userId: { type: DataTypes.INTEGER, allowNull: false },
            answerId: { type: DataTypes.INTEGER, allowNull: false },
            questionId: { type: DataTypes.INTEGER, allowNull: false },

        },
        { sequelize, modelName: 'UserAnswers' },
    );
    UserAnswers.removeAttribute("id");
    return UserAnswers;
};
