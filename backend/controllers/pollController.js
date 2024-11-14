const { createPoll } = require('../services/pollServices');

async function handleCreatePoll(req, res) {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Poll text is required' });
        }
        const newPoll = await createPoll(name);
        res.status(201).json(newPoll);
    } catch (error) {
        console.error('Error inserting poll:', error);
        res.status(500).json({error: 'Error creating poll in controller' });
    }
}

/*async function handleFetchPolls(req, res) {
    try {
        const polls = await fetchPolls();
        res.status(200).json(polls); // Send the polls as a response
    } catch (error) {
        console.error('Error fetching polls:', error);
        res.status(500).json({ error: 'Error fetching polls in controller' });
    }
}*/

module.exports = {
    handleCreatePoll: handleCreatePoll
}
