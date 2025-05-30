// models/polls.js
const { Model, DataTypes } = require('sequelize');

// defines polls
module.exports = (sequelize) => {
    class AnonymousVoting extends Model {
        static associate(models) {  // define relations
            Polls.hasMany(models.Questions, { foreignKey: 'pollId' }); // 1 poll has many questions
            Polls.hasMany(models.PublicUserData, { foreignKey: 'pollId' });
        }
    }

    // gives poll atributes
    Polls.init(
        {
            name: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: true },
            user_id: { type: DataTypes.INTEGER, allowNull: false},
            public: { type: DataTypes.BOOLEAN, allowNull: false},
                anonymous: { type: DataTypes.BOOLEAN, allowNull: false},
                publish_date: { type: DataTypes.DATE, allowNull: false },
                end_date: { type: DataTypes.DATE, allowNull: false }
        },
        {
            sequelize,
            modelName: 'Polls',
        }
    );

    return AnonymousVoting
}
