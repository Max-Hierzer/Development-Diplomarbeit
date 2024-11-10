// services/votingService.js
const { UserAnswers } = require('../models');

async function submitVote(userId, questionId, answerId) {
    // Check if the user has already voted on this question
    const existingVote = await UserAnswers.findOne({ where: { userId, questionId } });
    if (existingVote) {
        throw new Error('User has already voted on this question.');
    }

    // Create a new vote entry in UserAnswers
    return await UserAnswers.create({ userId, questionId, answerId });
}

module.exports = { submitVote };
