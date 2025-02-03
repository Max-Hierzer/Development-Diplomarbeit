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
const Roles = require('./roles')(sequelize, DataTypes);
const PublicUserData = require('./publicUserData')(sequelize, DataTypes);
const QuestionTypes = require('./questionTypes')(sequelize, DataTypes);
const UserPolls = require('./userPolls')(sequelize, DataTypes);

// set up relations
Users.associate({ UserAnswers, Roles, UserPolls });
UserAnswers.associate({ Users, Answers, Questions });
Answers.associate({ UserAnswers, Answers, Questions });
Questions.associate({ UserAnswers, Questions, Answers, Polls, QuestionTypes });
Polls.associate({ Questions, PublicUserData, UserPolls });
Roles.associate({ Users }); 
PublicUserData.associate({ Polls });
QuestionTypes.associate({ Questions });
UserPolls.associate({ Polls, Users });

module.exports = { sequelize, Users, UserAnswers, Answers, Questions, Polls, Roles, PublicUserData, QuestionTypes, UserPolls };