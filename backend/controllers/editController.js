// controllers/pollController.js
const editService = require('../services/editService');

const editController = {
    async updatePoll(req, res) {
        try {
            const { id } = req.params;
            const updatedPoll = await editService.updatePoll(id, req.body);
            res.json(updatedPoll);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = editController;
