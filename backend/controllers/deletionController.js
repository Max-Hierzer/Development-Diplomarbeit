// controllers/deletionsController.js

const deletionService = require('../services/deletionServices');

// Delete poll by ID
const deletePoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        if (!pollId) {
            return res.status(400).json({ error: 'Poll ID is required.' });
        }

        const result = await deletionService.deletePoll(pollId);
        res.status(200).json({ message: 'Poll deleted successfully.', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { deletePoll };
