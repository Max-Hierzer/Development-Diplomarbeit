const { Model, DataTypes } = require('sequelize');

// defines polls
module.exports = (sequelize) => {
    class Polls extends Model {
        static associate(models) {  // define relations
            Polls.hasMany(models.Questions, { foreignKey: 'pollId' }); // 1 poll has many questions
        }
    }

    // gives poll atributes
    Polls.init(
        {
            name: { type: DataTypes.STRING, allowNull: false }
        },
        { sequelize, modelName: 'Polls' }
    );

    return Polls
}
