const { Polls: Poll } = require('../models');
const { Questions: Question } = require('../models');
const { Answers: Answer } = require('../models');

async function createPoll(poll, questions) {
    try {
        const pollPublishDate = new Date(poll.publishDate).toISOString();
        const pollEndDate = new Date(poll.endDate).toISOString();
        const createdPoll = await Poll.create({ name: poll.name, description: poll.description, publish_date: pollPublishDate, end_date: pollEndDate });

        const createdQuestions = [];
        for (const question of questions) {
            const createdQuestion = await Question.create({
                name: question.name,
                pollId: createdPoll.id,
            });

            const createdAnswers = [];
            for (const answer of question.answers) {
                const [createdAnswer] = await Answer.findOrCreate({
                    where: { name: answer.name },
                });
                createdAnswers.push(createdAnswer);
            }

            await createdQuestion.addAnswers(createdAnswers);

            createdQuestions.push(createdQuestion);
        }

        return {
            poll: createdPoll,
            questions: createdQuestions,
        };
    } catch (error) {
        console.error('Error creating poll in service:', error);
        throw error;
    }
}

module.exports = {
    createPoll,
};
