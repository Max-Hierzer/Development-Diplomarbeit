// controllers/voteController.js
const { submitVote, submitPublicVote } = require('../services/votingServices');

// resolves api connection with frontend for to input votes
async function handleVote(req, res) {
    const { userId, answers } = req.body; // `answers` should be an object of questionId: answerId pairs

    try {
        await submitVote(userId, answers);  // passes the votes to service
        return res.status(200).json({ message: 'Vote(s) successfully recorded' });
    } catch (error) {
        console.error('Error submitting vote:', error);
        return res.status(400).json({ error: error.message });
    }
}

async function handlePublicVote(req, res) {
    const { answers, userData } = req.body; // `answers` should be an object of questionId: answerId pairs

    try {
        await submitPublicVote(answers, userData);  // passes the votes to service
        return res.status(200).json({ message: 'Vote(s) successfully recorded' });
    } catch (error) {
        console.error('Error submitting vote:', error);
        return res.status(400).json({ error: error.message });
    }
}

module.exports = { handleVote, handlePublicVote };
