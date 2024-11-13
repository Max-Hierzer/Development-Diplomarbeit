// controllers/voteController.js
const { submitVote } = require('../services/votingServices');

async function handleVote(req, res) {
    const { userId, answers } = req.body; // `answers` should be an object of questionId: answerId pairs

    try {
        console.log(userId, answers)
        // Call the service to submit the vote
        await submitVote(userId, answers);
        return res.status(200).json({ message: 'Vote(s) successfully recorded' });
    } catch (error) {
        console.error('Error submitting vote:', error);
        return res.status(400).json({ error: error.message });
    }
}

module.exports = { handleVote };
