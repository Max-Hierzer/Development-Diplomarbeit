// models/UserRoles.js
const { Model, DataTypes } = require('sequelize');

// define UserRoles
module.exports = (sequelize, DataTypes) => {
    class UserRoles extends Model {
        static associate(models) {
            // Define the relation of UserRoles to Users
            UserRoles.hasMany(models.Users, { foreignKey: 'roleId' }); // One Role belongs to many Users
        }
    }

    // Define attributes for the UserRoles model
    UserRoles.init(
        {
            roleName: { type: DataTypes.STRING, allowNull: false, unique: true },
            description: { type: DataTypes.STRING }
        },
        { sequelize, modelName: 'UserRoles' }
    );

    return UserRoles;
};