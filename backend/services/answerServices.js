const { Answers: Answer } = require('../models');

async function createAnswer(name) {
    try {
        const answer = await Answer.create({ name });
        return answer;
    } catch (error) {
        console.error('Error creating answer in service:', error);
        throw error;
    }
}

async function fetchAnswers() {
    try {
        const answers = await Answer.findAll();
        return answers;
    } catch (error) {
        console.error('Error fetching answers in service:', error);
        throw error;
    }

}

module.exports = {
    createAnswer: createAnswer,
    fetchAnswers: fetchAnswers
};
