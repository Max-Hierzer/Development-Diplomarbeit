// models/message.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

class Message extends Model {}

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
