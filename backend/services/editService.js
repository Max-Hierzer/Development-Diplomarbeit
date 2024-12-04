// services/pollService.js
const { Poll, Question, Answer } = require('../models');

const editService = {
    async updatePoll(pollId, data) {
        const poll = await Poll.findByPk(pollId);
        if (!poll) throw new Error('Poll not found');

        // Update poll name
        await poll.update({ name: data.name });

        // Handle questions and answers
        for (const question of data.Questions) {
            if (question.id) {
                // Update existing question
                const existingQuestion = await Question.findByPk(question.id);
                if (existingQuestion) {
                    await existingQuestion.update({ name: question.name });

                    // Update or delete answers
                    const existingAnswers = await Answer.findAll({ where: { questionId: question.id } });
                    const answerIds = question.answers.map((a) => a.id).filter((id) => id);
                    const answersToDelete = existingAnswers.filter((a) => !answerIds.includes(a.id));

                    for (const answer of question.answers) {
                        if (answer.id) {
                            const existingAnswer = existingAnswers.find((a) => a.id === answer.id);
                            if (existingAnswer) await existingAnswer.update({ name: answer.name });
                        } else {
                            // Add new answer
                            await Answer.create({ name: answer.name, questionId: question.id });
                        }
                    }

                    // Delete removed answers
                    for (const answer of answersToDelete) {
                        await answer.destroy();
                    }
                }
            } else {
                // Create new question and its answers
                const newQuestion = await Question.create({
                    name: question.name,
                    pollId: poll.id,
                });

                for (const answer of question.answers) {
                    await Answer.create({
                        name: answer.name,
                        questionId: newQuestion.id,
                    });
                }
            }
        }

        // Return the updated poll structure
        return Poll.findByPk(pollId, {
            include: [
                {
                    model: Question,
                    as: 'Questions',
                    include: [{ model: Answer, as: 'Answers' }],
                },
            ],
        });
    },
};

module.exports = editService;
