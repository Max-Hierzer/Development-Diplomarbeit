// services/votingService.js
const { UserAnswers } = require('../models');

async function registerVote(userId, questionId, answerId) {
    try {
        const vote = await UserAnswers.create({ userId, questionId, answerId });
        return vote;
    } catch (error) {
        console.error('Error registering vote in service:', error);
        throw error;
    }
}

module.exports = { registerVote };
