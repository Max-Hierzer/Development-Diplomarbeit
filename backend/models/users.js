const { Model, DataTypes } = require('sequelize');

// define users
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {  // define relations
            Users.hasMany(models.UserAnswers, { foreignKey: 'userId' });    // 1 user has many UserAnswers
        }
    }
    // define attributes
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
