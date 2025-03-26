// models/polls.js
const { Model, DataTypes } = require('sequelize');

// defines polls
module.exports = (sequelize) => {
    class PublicUserData extends Model {
        static associate(models) {
            // Define the association between PublicUserData and Polls
            this.belongsTo(models.PublicAnswers, { foreignKey: 'publicAnswerId' });
            this.belongsTo(models.PublicQuestions,  { foreignKey: 'publicQuestionId' })
        }
    }
    PublicUserData.init(
        {
            publicAnswerId: { type: DataTypes.INTEGER, allowNull: false},
            publicQuestionId: { type: DataTypes.INTEGER, allowNull: false},

        },

        { sequelize, modelName: 'PublicUserData',
            indexes: [
                {
                    unique: true,
                    fields: ['publicAnswerId', 'publicQuestionId']
                }
            ] },
    );

    return PublicUserData
}

