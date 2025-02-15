const { UserAnswers, Polls, Questions, QuestionTypes, Answers, PublicVotes, UserPolls } = require('../models/index');

async function fetchResults(pollId, questions) {
    try {
        const totalVotes = await UserPolls.count({
            where: { pollId }
        });

        const questionVotes = {};
        const answerPercentages = {};

        for (const question of questions) {
            const questionVotesCount = await UserAnswers.count({
                where: { questionId: question.id }
            })
            questionVotes[question.id] = questionVotesCount;

            for (const answer of question.Answers) {
                const answerVotesCount = await UserAnswers.count({
                    where: {
                        questionId: question.id,
                        answerId: answer.id
                    }
                })
                const percentage = questionVotesCount > 0 ? ((answerVotesCount / questionVotesCount) * 100).toFixed(2) : "0.00";

                answerPercentages[answer.id] = percentage;
            }
        }

        return {
            totalVotes,
            questionVotes,
            answerPercentages
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
