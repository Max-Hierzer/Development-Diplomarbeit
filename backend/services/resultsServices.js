const { UserAnswers, Polls, Questions, Answers } = require('../models/index');

async function fetchResults() {
    try {
        const results = await UserAnswers.findAll({
            attributes: ['userId', 'answerId', 'questionId'],
            include: [
            {
                Answers,
                Questions
            }
            ]
        });
        return results;
    }
    catch (error) {
        console.error('Error fetching results in service: ', error);
        throw error;
    }
}

async function fetchPolls() {
    try {
        const polls = await Polls.findAll({
            attributes: ['name'],
            include: [Questions]
        });
        return polls;
    }
    catch (error) {
        console.error('Error fetching polls in service: ', error);
        throw error;
    }
}

module.exports = { fetchResults, fetchPolls };
