const { fetchResults, fetchPolls } = require('../services/resultsServices');

async function handleFetchResults(req, res) {
    try {
        const results = await fetchResults();
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching results in Controller: ', error);
        res.status(500).json({error: 'Error fetching results in controller'});
    }
}

async function handleFetchPolls(req, res) {
    try {
        const polls = await fetchPolls();
        res.status(200).json(polls);
    } catch (error) {
        console.error('Error fetching polls in Controller: ', error);
        res.status(500).json({error: 'Error fetching results in controller'});
    }
}

module.exports = { handleFetchResults, handleFetchPolls };
