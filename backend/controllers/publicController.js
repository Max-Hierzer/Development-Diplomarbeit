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
    async handleFetchPoll(req, res) {
        try {
            const poll = await publicService.fetchPoll(req.params.id);
            res.status(200).json(poll);
        } catch (error) {
            console.error('Error fetching Poll in Controller: ', error)
            res.status(500).json({error: 'Error fetching Poll: ', error})
        }
    }
};

module.exports = publicController;
