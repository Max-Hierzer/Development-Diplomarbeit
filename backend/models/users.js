// models/users.js
const { Model, DataTypes } = require('sequelize');

// define users
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {  // define relations
            Users.hasMany(models.UserAnswers, { foreignKey: 'userId' });    // 1 user has many UserAnswers
            Users.belongsTo(models.UserRoles, { foreignKey: 'roleId' });    // 1 user belongs to 1 role
        }
    }
    // define attributes
    Users.init(
        {
            name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: false },
            roleId: { 
                type: DataTypes.INTEGER, 
                allowNull: false, 
                defaultValue: 3, // Default to "Normal" role
                references: {
                    model: 'UserRoles',
                    key: 'id',
                }
            },
        },
        { sequelize, modelName: 'Users' }
    );
    

    return Users;
};