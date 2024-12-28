// models/roles.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    static associate(models) {
      Roles.belongsToMany(models.Users, { 
        through: 'UserRoles', 
        foreignKey: 'roleId', 
        otherKey: 'userId' 
      });
    }
  }

  Roles.init(
    {
      name: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
      },
      description: { 
        type: DataTypes.STRING 
      }
    },
    { 
      sequelize, 
      modelName: 'Roles' 
    }
  );

  return Roles;
};