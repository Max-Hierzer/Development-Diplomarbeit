// controllers/csvExportController.js
const { Polls, Questions, Answers, QuestionTypes } = require('../models');
const resultsService = require('../services/resultsServices');
const { Parser } = require('json2csv');

exports.exportPollResults = async (req, res) => {
    const { pollId } = req.params;

    try {
        const poll = await Polls.findByPk(pollId, {
            attributes: ['name', 'description'],
            include: [
                {
                    model: Questions,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: QuestionTypes,
                            as: 'QuestionType',
                            attributes: ['name'],
                        },
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

        const voteResults = await resultsService.fetchCSVResults();
        const voteDetails = {}; // { questionId: { answerId: { count, weightSum } } }
        const userVotes = {};   // { userId: { questionId: true } } 

        voteResults.forEach((vote) => {
            const { answerId, questionId, userId, weight } = vote;

            // Find question type
            const question = poll.Questions.find(q => q.id === questionId);
            const questionType = question?.QuestionType?.name || 'Unknown';

            if (!voteDetails[questionId]) {
                voteDetails[questionId] = {};
            }

            if (!voteDetails[questionId][answerId]) {
                voteDetails[questionId][answerId] = { count: 0, weightSum: 0 };
            }

            // Handle Single Choice correctly
            if (questionType === 'Single Choice') {
                if (!voteDetails[questionId][answerId]) {
                    voteDetails[questionId][answerId] = { count: 0, weightSum: 0 };
                }
                voteDetails[questionId][answerId].count += 1;
            }

            // Handle Weighted Choice correctly
            if (questionType === 'Weighted Choice' && weight) {
                voteDetails[questionId][answerId].weightSum += weight;
            }
        });

        // Prepare CSV data
        const csvData = [];
        poll.Questions.forEach((question) => {
            const questionType = question.QuestionType ? question.QuestionType.name : 'Unknown';

            question.Answers.forEach((answer) => {
                const details = voteDetails[question.id]?.[answer.id] || { count: 0, weightSum: 0 };

                // Compute average weight only for Weighted Choice questions
                const averageWeight =
                    questionType === 'Weighted Choice'
                        ? (details.count > 0 ? (details.weightSum / details.count).toFixed(2) : 0)
                        : '';
                console.log(details.count);
                csvData.push({
                    Poll: poll.name,
                    Description: poll.description,
                    Question: question.name,
                    QuestionType: questionType,
                    Answer: answer.name,
                    VoteCount: details.count,
                    'Average Weight': averageWeight,
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
