// models/polls.js
const { Model, DataTypes } = require('sequelize');

// defines polls
module.exports = (sequelize) => {
    class PublicUserData extends Model {
        static associate(models) {
            // Define the association between PublicUserData and Polls
            this.belongsTo(models.Polls, { foreignKey: 'pollId' });
        }
    }
    PublicUserData.init(
        {
            gender: { type: DataTypes.STRING, allowNull: false },
            age: { type: DataTypes.INTEGER, allowNull: false },
            job: { type: DataTypes.STRING, allowNull: false },
            pollId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Polls' , key: 'id' } }
        },
        { sequelize, modelName: 'PublicUserData' }
    );

    return PublicUserData
}

