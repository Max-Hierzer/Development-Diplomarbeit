// controllers/votingController.js
const votingService = require('../services/votingService');

async function submitVote(req, res) {
    const { userId, questionId, answerId } = req.body;
    try {
        const vote = await votingService.submitVote(userId, questionId, answerId);
        res.status(201).json({ message: 'Vote submitted successfully', vote });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { submitVote };
