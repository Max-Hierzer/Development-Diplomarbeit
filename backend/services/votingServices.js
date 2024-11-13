// services/voteService.js
const { UserAnswers, Users, Answers, Questions } = require('../models/index');

async function submitVote(userId, answers) {
    // Insert answers into the `UserAnswers` table
    const userAnswersPromises = Object.entries(answers).map(([questionId, answerId]) =>
    UserAnswers.create({ userId, answerId, questionId })
    );

    await Promise.all(userAnswersPromises);
}

module.exports = { submitVote };
