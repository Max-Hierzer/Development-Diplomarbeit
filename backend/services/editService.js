// services/pollService.js
const { sequelize, Polls, Questions, Answers } = require('../models');

const pollService = {
    async updatePoll(pollId, data) {
        const poll = await Polls.findByPk(pollId);
        if (!poll) throw new Error('Poll not found');

        // Update poll name
        await poll.update({ name: data.name });
        console.log('Poll updated');

        // Handle questions and answers
        for (const question of data.Questions) {
            if (question.id) {
                // Update existing question
                const existingQuestion = await Questions.findByPk(question.id);
                if (existingQuestion) {
                    await existingQuestion.update({ name: question.name });

                    // Handle answers (many-to-many relation)
                    const existingAnswers = await existingQuestion.getAnswers();

                    const answerIds = question.Answers.map((a) => a.id).filter((id) => id);
                    const answersToDelete = existingAnswers.filter(
                        (a) => !answerIds.includes(a.id)
                    );

                    // Add or update answers in the join table
                    for (const answer of question.Answers) {
                        if (answer.id) {
                            // If answer exists, just add it to the question
                            await existingQuestion.addAnswer(answer.id);
                        } else {
                            // Add new answer and associate it with the question
                            const newAnswer = await Answers.create({ name: answer.name });
                            await existingQuestion.addAnswer(newAnswer.id);
                        }
                    }

                    // Delete answers that are no longer associated with this question
                    for (const answer of answersToDelete) {
                        await existingQuestion.removeAnswer(answer.id);
                    }
                }
            } else {
                // Create new question and associate answers
                const newQuestion = await Questions.create({
                    name: question.name,
                    pollId: poll.id,
                });

                for (const answer of question.Answers) {
                    const newAnswer = await Answers.create({ name: answer.name });
                    await newQuestion.addAnswer(newAnswer.id);
                }
            }
        }

        // Fetch the updated poll with associated questions and answers
        return Polls.findByPk(pollId, {
            include: [
                {
                    model: Questions,
                    include: [{ model: Answers}],
                },
            ],
        });
    },
};

module.exports = pollService;
