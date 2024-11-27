const { fetchResults, fetchPolls } = require('../services/resultsServices');

// resolves api connection with frontend for the display of the results
async function handleFetchResults(req, res) {
    try {
        const results = await fetchResults();   // gets results from service
        res.status(200).json(results);          // sends results to frontend
    } catch (error) {
        console.error('Error fetching results in Controller: ', error);
        res.status(500).json({error: 'Error fetching results in controller'});
    }
}

// resolves api connection with frontend for the display of the polls
async function handleFetchPolls(req, res) {
    try {
        const polls = await fetchPolls();       // gets polls from service
        res.status(200).json(polls);            // sernds polls to frontend
    } catch (error) {
        console.error('Error fetching polls in Controller: ', error);
        res.status(500).json({error: 'Error fetching results in controller'});
    }
}

module.exports = { handleFetchResults, handleFetchPolls };
