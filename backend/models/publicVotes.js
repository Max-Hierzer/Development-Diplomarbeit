
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class PublicVotes extends Model {
        static associate(models) {  // define relations
            PublicVotes.belongsTo(models.Answers, { foreignKey: 'answerId' });
            PublicVotes.belongsTo(models.Questions, { foreignKey: 'questionId' });
        }
    }

    PublicVotes.init(
        {
            answerId: { type: DataTypes.INTEGER, allowNull: false },
            questionId: { type: DataTypes.INTEGER, allowNull: false },
        },

        { sequelize, modelName: 'PublicVotes' }
    );
    return PublicVotes;
};
