// models/polls.js
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
            name: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: true },
            publish_date: { type: DataTypes.DATE, allowNull: false },
            end_date: { type: DataTypes.DATE, allowNull: false }
        },
        {
            sequelize,
            modelName: 'Polls',
            validate: {
                publishDateInFuture() {
                    if (this.publish_date <= new Date()) {
                        throw new Error('Publish date must be in the future.');
                    }
                },
                endDateAfterPublishDate() {
                    if (this.end_date <= this.publish_date) {
                        throw new Error('End date must be later than publish date.');
                    }
                }
            }
        }
    );

    return Polls
}
