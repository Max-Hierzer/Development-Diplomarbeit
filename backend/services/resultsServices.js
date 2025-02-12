const { UserAnswers, Polls, Questions, QuestionTypes, Answers, PublicVotes } = require('../models/index');

// getting results from database
async function fetchResults() {
    try {
        const userAnswers = await UserAnswers.findAll({
            attributes: ['userId', 'answerId', 'questionId'],
        });

        return userAnswers;
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

module.exports = { fetchResults, fetchPolls };
