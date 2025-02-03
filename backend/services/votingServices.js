// services/voteService.js
const { UserAnswers, Users, Answers, Questions, PublicUserData, UserPolls } = require('../models/index');

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
        console.log(answers)
            if (existingVote) {                                         // if he has already voted for this question throw error to not violate unique constraint
                throw new Error(`User has already voted for question ${questionId} with answer ${answerId}`);
            }
        }

        const userAnswers = Object.entries(answers).map(([questionId, data]) =>     // ONLY WORKS FOR SINGLE CHOICE!!! maps all questions with given answer
        UserAnswers.create({
            userId,
            questionId: questionId,
            answerId: data.answerId,
            weight: data.importance
        }));                  // creates entry in UserAnswers with attributes userId, answerId, questionId

        return userAnswers;
    } catch (error) {
        console.error('Error creating vote in service:', error);
        throw error;
    }
}

async function submitAnonymousVote(answers, userId, pollId) {
    try {
        // Check if the user has already voted in this poll
        const existingVote = await UserPolls.findOne({
            where: { userId, pollId }
        });

        if (existingVote) {
            return { message: "You have already voted" };
        }

        // Create user answers
        const userAnswers = await Promise.all(
            Object.entries(answers).map(([questionId, data]) =>
            UserAnswers.create({
                questionId: questionId,
                answerId: data.answerId,
                weight: data.importance || null
            })
            )
        );

        // Create a record in UserPolls to mark that this user has voted
        await UserPolls.create({ userId, pollId });

        return { message: "vote submitted successfully", userAnswers };
    } catch (error) {
        console.error('Error creating vote in service:', error);
        throw error;
    }
}


async function submitPublicVote(answers, userData) {
    try {
        const publicUserData = await PublicUserData.create({
            gender: userData.gender,
            age: userData.age,
            job: userData.job,
            pollId: userData.pollId
        });

        const publicAnswers = Object.entries(answers).map(([questionId, answerId]) =>
        UserAnswers.create({ answerId, questionId })
        );
        return userAnswers;
    } catch (error) {
        console.error('Error creating vote in service:', error);
        throw error;
    }
}

module.exports = { submitVote };
