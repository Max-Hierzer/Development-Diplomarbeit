const { Polls, Questions, Answers } = require('../models');

const editService = {
    async updatePoll(data) {
        const poll = await Polls.findByPk(data.pollId);
        if (!poll) throw new Error('Poll not found');

        // Update poll name
        await Polls.update({ name: data.pollName }, { where: { id: data.pollId } });
        console.log('Poll updated successfully');

        // Get all existing questions for this poll
        const existingQuestions = await Questions.findAll({
            where: { pollId: data.pollId },
        });

        // Process incoming questions
        for (const question of data.Questions) {
            if (question.id) {
                // Update existing question
                const existingQuestion = await Questions.findByPk(question.id);
                if (existingQuestion) {
                    await existingQuestion.update({ name: question.name });

                    // Clear all answers for the question
                    await existingQuestion.setAnswers([]);

                    // Add new answers
                    for (const answer of question.Answers) {
                        const newAnswer = await Answers.create({ name: answer.name });
                        await existingQuestion.addAnswer(newAnswer);
                    }
                }
            } else {
                // Create new question and associate answers
                const newQuestion = await Questions.create({
                    name: question.name,
                    pollId: data.pollId,
                });

                for (const answer of question.Answers) {
                    const newAnswer = await Answers.create({ name: answer.name });
                    await newQuestion.addAnswer(newAnswer);
                }
            }
        }

        // Delete questions that are in the database but not in the incoming data
        const incomingQuestionIds = data.Questions.map(q => q.id).filter(id => id);
        const questionsToDelete = existingQuestions.filter(q => !incomingQuestionIds.includes(q.id));

        for (const question of questionsToDelete) {
            await question.removeAnswers(); // Remove all associations
            await question.destroy(); // Delete the question
            console.log(`Deleted question with id ${question.id}`);
        }

        // Fetch the updated poll with associated questions and answers
        return Polls.findByPk(data.pollId, {
            include: [
                {
                    model: Questions,
                    include: [{ model: Answers }],
                },
            ],
        });
    },
};

module.exports = editService;
