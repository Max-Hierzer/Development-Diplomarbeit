const { PublicQuestions, QuestionTypes, PublicAnswers, Polls, Questions, Answers, PublicPollQuestions } = require('../models');

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
    }


};


module.exports = publicService;
