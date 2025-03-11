// models/users.js
const { Model, DataTypes } = require('sequelize');

// define users
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {  // define relations
            Users.belongsTo(models.Roles, { foreignKey: 'roleId' });
            Users.hasMany(models.UserAnswers, { foreignKey: 'userId' });    // 1 user has many UserAnswers
            Users.hasMany(models.UserPolls, { foreignKey: 'userId' });
        }
    }
    // define attributes
    Users.init(
        {
            name: { type: DataTypes.STRING, allowNull: true },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: true },
            token: { type: DataTypes.STRING, allowNull: true, unique: true }
        },
        { sequelize, modelName: 'Users' }
    );

    return Users;
};
