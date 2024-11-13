// models/message.js
const { Model, DataTypes } = require('sequelize');

// define message
class Message extends Model {}

// gives message attributes
Message.init(
  {
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { sequelize, modelName: 'Message' }
);

module.exports = Message;
