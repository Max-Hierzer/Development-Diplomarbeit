// services/voteService.js
const { UserAnswers, Users, Answers, Questions } = require('../models/index');

// writing vote in UserAnswers
async function submitVote(userId, answers) {
    try {
        for (const [questionId, answerId] of Object.entries(answers)) { // checking if user has already voted
            const existingVote = await UserAnswers.findOne({
                where: {                                                // get user if he has voted for this question
                    userId: userId,
                    questionId: questionId,
                },
            });

            if (existingVote) {                                         // if he has already voted for this question throw error to not violate unique constraint
                throw new Error(`User has already voted for question ${questionId} with answer ${answerId}`);
            }
        }
        const userAnswers = Object.entries(answers).map(([questionId, answerId]) =>     // ONLY WORKS FOR SINGLE CHOICE!!! maps all questions with given answer
        UserAnswers.create({ userId, answerId, questionId })                            // creates entry in UserAnswers with attributes userId, answerId, questionId
        );
        return userAnswers;
    } catch (error) {
        console.error('Error creating vote in service:', error);
        throw error;
    }
}

module.exports = { submitVote };
