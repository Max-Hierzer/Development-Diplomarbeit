// seeders/20250317-seed-poll.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const poll = await queryInterface.bulkInsert('Polls', [{
      name: 'Seederpoll',
      description: 'Das ist eine Umfrage welche beim Seeden erstellt wurde.',
      user_id: 1, 
      public: false,
      anonymous: false,
      publish_date: new Date(new Date().setDate(new Date().getDate() + 6)),
      end_date: new Date(new Date().setDate(new Date().getDate() + 7)), 
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true });

    const pollId = poll[0].id;

    const questionTypes = await queryInterface.sequelize.query(
      'SELECT id, name FROM "QuestionTypes" WHERE name IN (:names)',
      {
        replacements: { names: ['Single Choice', 'Multiple Choice', 'Weighted Choice'] },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    const singleChoiceTypeId = questionTypes.find(type => type.name === 'Single Choice').id;
    const multipleChoiceTypeId = questionTypes.find(type => type.name === 'Multiple Choice').id;
    const weightedChoiceTypeId = questionTypes.find(type => type.name === 'Weighted Choice').id;

    const questions = await queryInterface.bulkInsert('Questions', [
      {
        name: 'Was ist deine Lieblingsfarbe?',
        pollId: pollId,
        typeId: singleChoiceTypeId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Was ist dein Lieblingstier?',
        pollId: pollId,
        typeId: singleChoiceTypeId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Welche Sportarten betreibst du?',
        pollId: pollId,
        typeId: multipleChoiceTypeId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Welche Städte möchtest du besuchen?',
        pollId: pollId,
        typeId: multipleChoiceTypeId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wie wichtig sind dir diese Eigenschaften in einem Job? (Bitte bewerten)',
        pollId: pollId,
        typeId: weightedChoiceTypeId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wie viel Einfluss haben diese Faktoren auf deine Kaufentscheidung?',
        pollId: pollId,
        typeId: weightedChoiceTypeId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    const questionIds = questions.map(q => q.id);

    const answers = await queryInterface.bulkInsert('Answers', [
      { name: 'Blau', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Rot', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Grün', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gelb', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Hund', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Katze', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Vogel', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Hamster', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fußball', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Basketball', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tennis', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Schwimmen', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Paris', createdAt: new Date(), updatedAt: new Date() },
      { name: 'London', createdAt: new Date(), updatedAt: new Date() },
      { name: 'New York', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tokyo', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gehaltsniveau', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Arbeitszeiten', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Karrieremöglichkeiten', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Arbeitsumfeld', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Preis', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Marke', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Qualität', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Verfügbarkeit', createdAt: new Date(), updatedAt: new Date() }
    ], { returning: true });

    const answerIds = answers.map(a => a.id);

    await queryInterface.bulkInsert('QuestionAnswers', [
      { QuestionId: questionIds[0], AnswerId: answerIds[0], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[0], AnswerId: answerIds[1], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[0], AnswerId: answerIds[2], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[0], AnswerId: answerIds[3], createdAt: new Date(), updatedAt: new Date() },
      
      { QuestionId: questionIds[1], AnswerId: answerIds[4], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[1], AnswerId: answerIds[5], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[1], AnswerId: answerIds[6], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[1], AnswerId: answerIds[7], createdAt: new Date(), updatedAt: new Date() },
      
      { QuestionId: questionIds[2], AnswerId: answerIds[8], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[2], AnswerId: answerIds[9], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[2], AnswerId: answerIds[10], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[2], AnswerId: answerIds[11], createdAt: new Date(), updatedAt: new Date() },

      { QuestionId: questionIds[3], AnswerId: answerIds[12], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[3], AnswerId: answerIds[13], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[3], AnswerId: answerIds[14], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[3], AnswerId: answerIds[15], createdAt: new Date(), updatedAt: new Date() },

      { QuestionId: questionIds[4], AnswerId: answerIds[16], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[4], AnswerId: answerIds[17], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[4], AnswerId: answerIds[18], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[4], AnswerId: answerIds[19], createdAt: new Date(), updatedAt: new Date() },

      { QuestionId: questionIds[5], AnswerId: answerIds[20], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[5], AnswerId: answerIds[21], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[5], AnswerId: answerIds[22], createdAt: new Date(), updatedAt: new Date() },
      { QuestionId: questionIds[5], AnswerId: answerIds[23], createdAt: new Date(), updatedAt: new Date() }
    ], {});

    await queryInterface.bulkInsert('PollGroups', [{
      groupId: 1,
      pollId: pollId,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PollGroups', null, {});
    await queryInterface.bulkDelete('QuestionAnswers', null, {});
    await queryInterface.bulkDelete('Answers', null, {});
    await queryInterface.bulkDelete('Questions', null, {});
    await queryInterface.bulkDelete('Polls', null, {});
  }
};
