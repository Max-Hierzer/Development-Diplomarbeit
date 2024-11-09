const { UserAnswers } = require('../models/index');

async function fetchResults() {
    try {
        const results = await UserAnswers.findAll({
            attributes: ['userId', 'answerId', 'questionId']
        });
        return results;
    }
    catch (error) {
        console.error('Error fetching results', error);
        throw error;
    }
}

module.exports = fetchResults;
