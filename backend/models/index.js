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
<<<<<<< HEAD
=======
const PublicUserData = require('./publicUserData')(sequelize, DataTypes);
const QuestionTypes = require('./questionTypes')(sequelize, DataTypes);
>>>>>>> b6a87971 (added questiontypes table and now able to define questiontype for each question; also improved poll creation validation)

// set up relations
Users.associate({ UserAnswers, Roles }); 
UserAnswers.associate({ Users, Answers, Questions });
Answers.associate({ UserAnswers, Answers, Questions });
<<<<<<< HEAD
Questions.associate({ UserAnswers, Questions, Answers, Polls });
Polls.associate({ Questions });
Roles.associate({ Users }); 

module.exports = { sequelize, Users, UserAnswers, Answers, Questions, Polls, Roles };
=======
Questions.associate({ UserAnswers, Questions, Answers, Polls, QuestionTypes });
Polls.associate({ Questions, PublicUserData });
Roles.associate({ Users }); 
PublicUserData.associate({ Polls });
QuestionTypes.associate({ Questions });

module.exports = { sequelize, Users, UserAnswers, Answers, Questions, Polls, Roles, PublicUserData, QuestionTypes };
>>>>>>> b6a87971 (added questiontypes table and now able to define questiontype for each question; also improved poll creation validation)
