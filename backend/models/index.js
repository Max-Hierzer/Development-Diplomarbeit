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
const Groups = require('./groups')(sequelize, DataTypes);
const UserGroups = require('./userGroups')(sequelize, DataTypes);
const PollGroups = require('./pollGroups')(sequelize, DataTypes);
const PublicQuestions = require('./publicQuestions')(sequelize, DataTypes);
const PublicAnswers = require('./publicAnswers')(sequelize, DataTypes);
const PublicPollQuestions = require('./publicPollQuestions')(sequelize, DataTypes);


// set up relations
Users.associate({ UserAnswers, Roles, UserPolls, UserGroups });
UserAnswers.associate({ Users, Answers, Questions });
Answers.associate({ UserAnswers, Answers, Questions });
Questions.associate({ UserAnswers, Questions, Answers, Polls, QuestionTypes });
Polls.associate({ Questions, UserPolls, PollGroups, PublicPollQuestions });
Roles.associate({ Users }); 
PublicUserData.associate({ PublicAnswers, PublicQuestions });
QuestionTypes.associate({ Questions, PublicQuestions });
UserPolls.associate({ Polls, Users });
Groups.associate({ PollGroups, UserGroups });
UserGroups.associate({ Users, Groups });
PollGroups.associate({ Polls, Groups });
PublicPollQuestions.associate({ PublicQuestions, Polls });
PublicQuestions.associate({ PublicUserData, PublicAnswers, PublicQuestions, QuestionTypes, PublicPollQuestions });
PublicAnswers.associate({ PublicUserData, PublicAnswers, PublicQuestions });


module.exports = { sequelize, Users, UserAnswers, Answers, Questions, Polls, Roles, PublicUserData, QuestionTypes, UserPolls, Groups, PollGroups, UserGroups, PublicQuestions, PublicAnswers, PublicPollQuestions };
