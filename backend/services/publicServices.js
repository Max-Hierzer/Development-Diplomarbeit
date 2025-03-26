const { PublicQuestions, QuestionTypes, PublicAnswers } = require('../models');

const publicService = {
    async fetchAll() {
        try {
            const questions = await PublicQuestions.findAll({                     // get data from Polls
                    attributes: ['id', 'name', 'typeId'],       // include id and name from question
                    include: [
                        { model: PublicAnswers, attributes: ['id', 'name'] },
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
    }
};

module.exports = publicService;
