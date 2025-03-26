// controllers/pollController.js
const publicService = require('../services/publicServices');

const publicController = {
    async handleFetchAll(req, res) {
        try {
            const allQuestions = await publicService.fetchAll();
            res.json(allQuestions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = publicController;
