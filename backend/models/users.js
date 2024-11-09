const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Users extends Model {
        static associate(models) {
            // Define associations
            Users.hasMany(models.UserAnswers, { foreignKey: 'userId' });
        }
    }

    Users.init(
        {
            name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: false }
        },
        { sequelize, modelName: 'Users' }
    );

    return Users;
};
