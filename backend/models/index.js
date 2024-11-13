// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json')['development'];

// connects to database
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// import models
const Users = require('./users')(sequelize, DataTypes);
const UserAnswers = require('./userAnswers')(sequelize, DataTypes);
const Answers = require('./answers')(sequelize, DataTypes);
const Questions = require('./questions')(sequelize, DataTypes);
const Polls = require('./polls')(sequelize, DataTypes);

// set up relations
Users.associate({ UserAnswers, Users });
UserAnswers.associate({ Users, Answers, Questions });
Answers.associate({ UserAnswers, Answers, Questions });
Questions.associate({ UserAnswers, Questions, Answers, Polls });
Polls.associate({ Questions });

module.exports = { sequelize, Users, UserAnswers, Answers, Questions, Polls };
