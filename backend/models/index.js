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
const PublicVotes = require('./publicVotes')(sequelize, DataTypes);
const PublicUserData = require('./publicUserData')(sequelize, DataTypes);

// set up relations
Users.associate({ UserAnswers, Roles }); 
UserAnswers.associate({ Users, Answers, Questions });
Answers.associate({ PublicVotes, UserAnswers, Answers, Questions });
Questions.associate({ PublicVotes, UserAnswers, Questions, Answers, Polls });
Polls.associate({ Questions, PublicUserData });
Roles.associate({ Users }); 
PublicVotes.associate({ Questions, Answers });
PublicUserData.associate({ Polls });

module.exports = { sequelize, Users, UserAnswers, Answers, Questions, Polls, Roles, PublicVotes, PublicUserData };
