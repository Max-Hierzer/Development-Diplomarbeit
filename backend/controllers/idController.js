const { fetchPollId } = require('../services/idServices');

async function handleFetchPollId(req, res) {
    try {
        const id = await fetchPollId();
        res.status(200).json(id);
    } catch (error) {
        console.error('Error fetching id in Controller: ', error);
        res.status(500).json({error: 'Error fetching id in controller'});
    }
}

module.exports = { handleFetchPollId };
