// services/deletionServices.js
const { sequelize, Polls, Questions, Answers } = require('../models'); // Adjust path if necessary

const deletePoll = async (pollId) => {
    const transaction = await sequelize.transaction();  // Use the sequelize instance
    try {
        // Ensure the poll exists
        const poll = await Polls.findByPk(pollId);
        if (!poll) {
            throw new Error('Poll not found.');
        }

        // Fetch all questions for the poll
        const questions = await Questions.findAll({ where: { pollId } });
        const questionIds = questions.map((q) => q.id);

        if (questionIds.length > 0) {
            // Delete associations in the intermediate table 'QuestionAnswers' for these questions
            await sequelize.models.QuestionAnswers.destroy({
                where: { QuestionId: questionIds },
                transaction,
            });

            // Fetch answer IDs associated with these questions (via QuestionAnswers)
            const answerIds = await sequelize.models.QuestionAnswers.findAll({
                where: { QuestionId: questionIds },
                attributes: ['AnswerId'],
                raw: true,
                transaction,
            }).then((records) => records.map((record) => record.AnswerId));

            // Delete the answers only if they exist
            if (answerIds.length > 0) {
                await Answers.destroy({
                    where: { id: answerIds },
                    transaction,
                });
            }
        }

        // Delete the questions
        await Questions.destroy({
            where: { pollId },
            transaction,
        });

        // Finally, delete the poll
        await Polls.destroy({
            where: { id: pollId },
            transaction,
        });

        // Commit the transaction
        await transaction.commit();

        return { pollId, questionsDeleted: questionIds.length };
    } catch (error) {
        // Rollback transaction if something goes wrong
        await transaction.rollback();
        throw error;
    }
};

module.exports = { deletePoll };
