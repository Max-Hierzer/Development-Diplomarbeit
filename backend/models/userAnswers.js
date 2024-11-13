const { Model, DataTypes } = require('sequelize');

// define UserAnswers
module.exports = (sequelize) => {
    class UserAnswers extends Model {
        static associate(models) {  // define relations
            UserAnswers.belongsTo(models.Users, { foreignKey: 'userId' });          // 1 UserAnswers belongsTo 1 User
            UserAnswers.belongsTo(models.Answers, { foreignKey: 'answerId' });      // 1 UserAnswers belongsTo 1 Answer
            UserAnswers.belongsTo(models.Questions, { foreignKey: 'questionId' });  // 1 UserAnswers belongsTo 1 Questions
        }
    }
    // define attributes
    UserAnswers.init(
        {
            userId: { type: DataTypes.INTEGER, allowNull: false },
            answerId: { type: DataTypes.INTEGER, allowNull: false },
            questionId: { type: DataTypes.INTEGER, allowNull: false },

        },

        { sequelize, modelName: 'UserAnswers', indexes: [
            {
                unique: true,
                fields: ['userId', 'answerId', 'questionId']  // Composite unique constraint
            }
        ], },

    );
    UserAnswers.removeAttribute("id");  // remove primary key id which is not needed with composite constraint [userId, answerId, questionId]
    return UserAnswers;
};
