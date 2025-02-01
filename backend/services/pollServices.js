const { Polls: Poll } = require('../models');
const { Questions: Question } = require('../models');
const { QuestionTypes: QuestionType } = require('../models');
const { Answers: Answer } = require('../models');

async function createPoll(poll, questions) {
    try {
        const pollPublishDate = new Date(poll.publishDate);
        const pollEndDate = new Date(poll.endDate);
        const createdPoll = await Poll.create({ name: poll.name, description: poll.description, user_id: poll.userId, public: poll.public, anonymous: poll.anon, publish_date: pollPublishDate, end_date: pollEndDate });

        const createdQuestions = [];
        for (const question of questions) {
            const questionType = await QuestionType.findOne({
                where: { name: question.type },
            });

            const createdQuestion = await Question.create({
                name: question.name,
                pollId: createdPoll.id,
                typeId: questionType.id,
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
