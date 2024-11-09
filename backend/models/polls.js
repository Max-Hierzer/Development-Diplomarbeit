const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Polls extends Model {
        static associate(models) {
            // Define associations
            Polls.hasMany(models.Questions, { foreignKey: 'pollId' });
        }
    }

    Polls.init(
        {
            name: { type: DataTypes.STRING, allowNull: false }
        },
        { sequelize, modelName: 'Polls' }
    );

    return Polls
}
