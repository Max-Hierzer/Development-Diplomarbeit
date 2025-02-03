// controllers/voteController.js
const { submitVote } = require('../services/votingServices');

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

async function handleAnonymousVote(req, res) {
    try {
        const answers = req.body.answers; // `answers` should be an object of questionId: answerId pairs
        const userId = req.body.userId;
        const pollId = req.body.pollId;
        const result = await submitAnonymousVote(answers, userId, pollId);  // passes the votes to service

        if (result.message === "You have already voted") {
            return res.status(400).json({ message: "You have already voted" });
        }

        return res.status(200).json({ message: "Vote successfully recorded" });
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

module.exports = { handleVote, handlePublicVote, handleAnonymousVote };
