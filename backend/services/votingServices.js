// services/voteService.js
const { UserAnswers, Users, Answers, Questions } = require('../models/index');

async function submitVote(userId, answers) {
    try {
        for (const [questionId, answerId] of Object.entries(answers)) {
            const existingVote = await UserAnswers.findOne({
                where: {
                    userId: userId,
                    questionId: questionId,
                },
            });

            if (existingVote) {
                throw new Error(`User has already voted for question ${questionId} with answer ${answerId}`);
            }
        }
        const userAnswers = Object.entries(answers).map(([questionId, answerId]) =>
        UserAnswers.create({ userId, answerId, questionId })
        );
        return userAnswers;
    } catch (error) {
        console.error('Error creating vote in service:', error);
        throw error;
    }
}

module.exports = { submitVote };
