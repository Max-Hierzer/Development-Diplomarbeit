// controllers/csvExportController.js
const { Polls } = require('../models');
const { Parser } = require('json2csv');

// Controller zum Exportieren der Poll-Daten als CSV
exports.exportPollResults = async (req, res) => {
    const { pollId } = req.params;
    console.log('Request received for poll ID:', pollId);

    try {
        const poll = await Polls.findByPk(pollId);

        if (!poll) {
            return res.status(404).json({ success: false, message: 'Poll not found' });
        }

        console.log('Poll found:', poll);

        // CSV aus den Poll-Daten
        const pollData = [
            {
                name: poll.name,
                description: poll.description,
                publish_date: poll.publish_date,
                end_date: poll.end_date,
            },
        ];

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(pollData);


        res.header('Content-Type', 'text/csv');
        res.attachment(`${poll.name}_poll.csv`);
        res.send(csv);
    } catch (error) {
        console.error('Error exporting poll results:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
