// controllers/csvExportController.js
const { Polls, Questions, Answers } = require('../models');
const resultsService = require('../services/resultsServices'); // Assuming fetchResults and fetchPolls are in this service
const { Parser } = require('json2csv');

// Controller to export poll data as CSV
exports.exportPollResults = async (req, res) => {
    const { pollId } = req.params;

    try {
        // Fetch poll data with related questions and answers
        const poll = await Polls.findByPk(pollId, {
            attributes: ['name', 'description'],
            include: [
                {
                    model: Questions,
                    attributes: ['name'],
                    include: [
                        {
                            model: Answers,
                            attributes: ['id', 'name'],
                        },
                    ],
                },
            ],
        });

        if (!poll) {
            return res.status(404).json({ success: false, message: 'Poll not found' });
        }

        // Fetch vote results
        const voteResults = await resultsService.fetchResults();

        // Count votes per answer
        const voteCounts = {};
        voteResults.forEach((vote) => {
            const answerId = vote.answerId;
            if (!voteCounts[answerId]) {
                voteCounts[answerId] = 0;
            }
            voteCounts[answerId]++;
        });

        // Prepare data for CSV
        const csvData = [];
        poll.Questions.forEach((question) => {
            question.Answers.forEach((answer) => {
                csvData.push({
                    Poll: poll.name,
                    Description: poll.description,
                    Question: question.name,
                    Answer: answer.name,
                    Votes: voteCounts[answer.id] || 0, // Default to 0 if no votes
                });
            });
        });

        // Generate CSV
        const json2csvParser = new Parser();

        const csv = json2csvParser.parse(csvData);

        res.header('Content-Type', 'text/csv');
        res.attachment(`${poll.name}_results.csv`);
        res.send(csv);
    } catch (error) {
        console.error('Error exporting poll results:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
