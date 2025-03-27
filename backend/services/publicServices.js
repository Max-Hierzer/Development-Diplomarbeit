const { PublicQuestions, QuestionTypes, PublicAnswers, Polls, Questions, Answers, PublicPollQuestions, PublicUserData, UserAnswers } = require('../models');
const { Parser } = require('json2csv');

const publicService = {
    async fetchAll() {
        try {
            const questions = await PublicQuestions.findAll({                     // get data from Polls
                    attributes: ['id', 'name', 'typeId'],       // include id and name from question
                    include: [
                        { model: PublicAnswers, attributes: ['id', 'name'], through: { attributes: [] }, },
                        { model: QuestionTypes, attributes: ['id', 'name'], as: 'QuestionType' }
                    ]
                }
            );
            return questions;
        }
        catch (error) {
            console.error('Error fetching polls in service: ', error);
            throw error;
        }
    },
    async fetchPoll(pollId) {
        try {
            const poll = await Polls.findOne({
                attributes: ['id', 'name', 'user_id', "public", "anonymous", 'publish_date', 'end_date', 'description', 'imageUrl'],
                where: { id: pollId },
                include: [
                    {
                        model: Questions,
                        attributes: ['id', 'name', 'typeId'],
                        include: [
                            { model: Answers, attributes: ['id', 'name'] },
                            { model: QuestionTypes, attributes: ['id', 'name'], as: 'QuestionType' }
                        ]
                    }
                ]
            });

            if (!poll) {
                throw new Error(`Poll with ID ${pollId} not found`);
            }

            const plainPoll = {
                id: poll.id,
                name: poll.name,
                user_id: poll.user_id,
                public: poll.public,
                    anonymous: poll.anonymous,
                    publish_date: poll.publish_date,
                    end_date: poll.end_date,
                    description: poll.description,
                    imageUrl: poll.imageUrl,
                    Questions: poll.Questions,
            };

            const publicPollQuestions = await PublicPollQuestions.findAll({
                where: { pollId: pollId },
                include: [
                    {
                        model: PublicQuestions,
                        attributes: ['id', 'name', 'typeId'],
                        include: [
                            { model: PublicAnswers, attributes: ['id', 'name'] },
                            { model: QuestionTypes, attributes: ['id', 'name'], as: 'QuestionType' }
                        ]
                    }
                ],
            });

            plainPoll.publicPollQuestions = publicPollQuestions.map(q => q.PublicQuestion);

            return plainPoll;
        }
        catch (error) {
            console.error('Error fetching polls in service: ', error);
            throw error;
        }
    },
    async vote(d) {
        try {
            const userAnswers = [];
            for (const [questionId, data] of Object.entries(d.answers)) {
                const { answer: answerIds, importance } = data;

                for (const answerId of answerIds) {
                    const createdAnswer = await UserAnswers.create({
                        questionId,
                        answerId,
                        weight: importance || null
                    });
                    userAnswers.push(createdAnswer);
                }
            }
            const pubAnswers = [];
            for (const [questionId, data] of Object.entries(d.publicAnswers)) {
                const { answer: answerIds, importance } = data;

                for (const answerId of answerIds) {
                    const createdAnswer = await PublicUserData.create({
                        publicQuestionId: questionId,
                        publicAnswerId: answerId,
                        pollId: d.pollId
                    });
                    pubAnswers.push(createdAnswer);
                }
            }
            return { message: "vote submitted successfully", answers: userAnswers, publicAnswers: pubAnswers };
        } catch (error) {
            console.error('Error creating vote in service:', error);
            throw error;
        }
    },
    async exports(pollId) {
        try {
            const voteResults = await PublicUserData.findAll({
                attributes: ['pollId', 'publicAnswerId', 'publicQuestionId'],
                where: { pollId: pollId },
            });

            const voteDetails = {};

            voteResults.forEach((vote) => {
                const { publicAnswerId, publicQuestionId, weight } = vote;

                if (!voteDetails[publicQuestionId]) {
                    voteDetails[publicQuestionId] = {};
                }
                if (!voteDetails[publicQuestionId][publicAnswerId]) {
                    voteDetails[publicQuestionId][publicAnswerId] = { count: 0, weightSum: 0 };
                }

                voteDetails[publicQuestionId][publicAnswerId].count += 1;
            });

            const poll = await Polls.findOne({
                attributes: ['name', 'description'],
                where: { id: pollId },
            });

            // Prepare CSV data for export
            const csvData = [];
            for (const questionId in voteDetails) {
                const question = voteDetails[questionId];

                const publicQuestion = await PublicQuestions.findByPk(questionId, {
                    include: [
                        {
                            model: QuestionTypes,
                            attributes: ['name'],
                            as: 'QuestionType',
                        },
                    ],
                });

                const questionType = publicQuestion?.QuestionType?.name || 'Unknown';

                for (const answerId in question) {
                    const details = question[answerId];
                    const answer = await PublicAnswers.findByPk(answerId);
                    csvData.push({
                        Umfragenname: poll.name,
                        Frage: publicQuestion.name,
                        Fragenart: questionType,
                        Antwort: answer ? answer.name : `Answer ${answerId}`,
                        Stimmenzahl: details.count,
                    });
                }
            }

            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(csvData);

            return csv;
        } catch (error) {
            console.error('Error exporting public poll results:', error);
            throw error;
        }
    }
};


module.exports = publicService;
