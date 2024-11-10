// controllers/votingController.js
const { registerVote } = require('../services/votingServices');

async function handleVote(req, res) {
    const { userId, questionId, answerId } = req.body;

    try {
        const vote = await registerVote(userId, questionId, answerId);
        res.status(201).json({ message: 'Vote registered successfully', vote });
    } catch (error) {
        res.status(500).json({ error: 'Error registering vote' });
    }
}

module.exports = { handleVote };
