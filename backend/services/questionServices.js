const { Questions: Question } = require('../models');

async function createQuestion(name, pollId) {
    try {
        const question = await Question.create({ name, pollId });
        return question;
    } catch (error) {
        console.error('Error creating question in service:', error);
        throw error;
    }
}

async function fetchQuestions() {
    try {
        const questions = await Question.findAll();
        return questions;
    } catch (error) {
        console.error('Error fetching questions in service:', error);
        throw error;
    }

}

module.exports = {
    createQuestion: createQuestion,
    fetchQuestions: fetchQuestions
};
