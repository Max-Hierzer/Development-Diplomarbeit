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
    },
    async handleVote(req, res) {
        try {
            const poll = await publicService.vote(req.body);
            res.status(200).json(poll);
        } catch (error) {
            console.error('Error fetching Poll in Controller: ', error)
            res.status(500).json({error: 'Error fetching Poll: ', error})
        }
    },
    async handleExport(req, res) {
        try {
            const csvData = await publicService.exports(req.params.id);

            res.header('Content-Type', 'text/csv');
            res.attachment(`${req.params.id}_results.csv`);
            res.send(csvData);
        } catch (error) {
            console.error('Error getting Export in Controller: ', error);
            res.status(500).json({ error: 'Error exporting Poll: ', message: error.message });
        }
    }

};

module.exports = publicController;
