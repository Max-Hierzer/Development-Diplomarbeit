// services/voteService.js
const { UserAnswers, Users, Answers, Questions, PublicUserData, UserPolls } = require('../models/index');

// writing vote in UserAnswers
async function submitVote(userId, answers) {
    try {
        for (const [questionId, data] of Object.entries(answers)) { // checking if user has already voted
            const { answer: answerIds, importance } = data;

            // Check if user has already voted
            for (const answerId of answerIds) {
                const existingVote = await UserAnswers.findOne({
                    where: { userId, questionId, answerId },
                });
                if (existingVote) {                                         // if he has already voted for this question throw error to not violate unique constraint
                    throw new Error(`User has already voted for question ${questionId} with answer ${answerId}`);
                }
                await UserAnswers.create({
                    userId,
                    questionId,
                    answerId,
                    weight: importance || null
                });                  // creates entry in UserAnswers with attributes userId, answerId, questionId
            } 
        }

        //const userAnswers = Object.entries(answers).map(([questionId, data]) =>     // ONLY WORKS FOR SINGLE CHOICE!!! maps all questions with given answer


        return { message: "Vote(s) successfully recorded."};
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
        const userAnswers = [];
        for (const [questionId, data] of Object.entries(answers)) {
            const { answer: answerIds, importance } = data;

            for (const answerId of answerIds) {
                const createdAnswer = await UserAnswers.create({
                    questionId,
                    answerId,
                    weight: importance || null
                });
                userAnswers.push(createdAnswer);
            }
        }

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

        const publicAnswers = [];
        for (const [questionId, data] of Object.entries(answers)) {
            const { answer: answerIds, importance } = data;
            
            for (const answerId of answerIds) {
                const createdAnswer = await UserAnswers.create({
                    questionId,
                    answerId,
                    weight: importance || null
                });
                publicAnswers.push(createdAnswer);
            }
        }
        
        return { message: "Public vote submitted succesfully", publicAnswers};
    } catch (error) {
        console.error('Error creating vote in service:', error);
        throw error;
    }
}

module.exports = { submitVote, submitPublicVote, submitAnonymousVote };
