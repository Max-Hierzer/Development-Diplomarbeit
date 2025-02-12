const { UserAnswers, Polls, Questions, QuestionTypes, Answers, PublicVotes, UserPolls } = require('../models/index');

async function fetchResults(questionId, answerId, pollId) {
    try {
        const totalVotes = await UserPolls.count({
            where: { pollId }
        });

        const questionVotes = await UserAnswers.count({
            where: { questionId }
        })

        const answerVotes = await UserAnswers.count({
            where: { questionId, answerId }
        })

        const percentage = ((answerVotes / (questionVotes || 1)) * 100).toFixed(2); // Avoid division by zero


        return {
            totalVotes,
            questionVotes,
            answerVotes,
            percentage
        }
    } catch (error) {
        console.error('Error fetching results in service: ', error);
        throw error;
    }
}

async function fetchResultData(pollId) {
    try {
        const resultData = await Polls.findOne({
            where: { id: pollId },
            include: [{
                model: Questions,
                include: [{
                    model: Answers,
                    include: [{
                        model:userAnswers,
                    }]
                }]
            }]
        });

        return resultData;
    } catch (error) {
        console.error('Error fetching results in service: ', error);
        throw error;
    }
}


// getting polls with relations from database
async function fetchPolls() {
    try {
        const polls = await Polls.findAll({                     // get data from Polls
            attributes: ['id', 'name', 'user_id', "public", "anonymous", 'publish_date', 'end_date', 'description'],                         // get attributes id and name from Polls
            include: [                                          // include questions related to poll
                {
                    model: Questions,
                    attributes: ['id', 'name', 'typeId'],       // include id and name from question
                    include: [
                        { model: Answers, attributes: ['id', 'name'] },
                        { model: QuestionTypes, attributes: ['id', 'name'], as: 'QuestionType' }
                    ]
                }
            ]
        });
        return polls;
    }
    catch (error) {
        console.error('Error fetching polls in service: ', error);
        throw error;
    }
}

module.exports = { fetchResults, fetchPolls, fetchResultData };
