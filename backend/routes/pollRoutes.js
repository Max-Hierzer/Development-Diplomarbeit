const express = require('express');
const { handleCreatePoll, handleGetPolls } = require('../controllers/pollController');
const { Poll } = require('../models'); // Import your Poll model

const router = express.Router();

// Endpoint to create a poll
const postPoll = router.post('/poll', handleCreatePoll);

// Endpoint to delete a poll
router.delete('/poll/:id', async (req, res) => {
    try {
        const pollId = req.params.id;

        // Perform the deletion in the database
        const result = await Poll.destroy({ where: { id: pollId } });

        if (result) {
            res.status(200).json({ message: 'Poll deleted successfully' });
        } else {
            res.status(404).json({ error: 'Poll not found' });
        }
    } catch (error) {
        console.error('Error deleting poll:', error);
        res.status(500).json({ error: 'Failed to delete poll' });
    }
});

const getPoll = router.get('/poll/user/:id', handleGetPolls)

module.exports = {
    postPoll: postPoll,
    deletePoll: router, // Ensure the delete route is exported
    getPoll: getPoll
};
