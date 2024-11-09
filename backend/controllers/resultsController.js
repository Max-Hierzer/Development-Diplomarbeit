const { fetchResults } = require('../services/resultsService');

asynch function handleFetchResults(req, res) {
    try {
        const results = await fetchResults();
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching results in Controller: ', error);
        res.status(500).json({error: 'Error fetching results in controller'});
    }
}

module.exports = handleFetchResults;
