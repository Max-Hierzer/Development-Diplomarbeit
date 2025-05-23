// services/deletionServices.js
const fs = require('fs');
const path = require('path');
const { sequelize, Polls, Questions, Answers, UserAnswers, PollGroups } = require('../models'); // Adjust path if necessary

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

        const userAnswersExist = await UserAnswers.findOne({
            where: { questionId: questionIds },
            transaction,
        });

        if (userAnswersExist) {
            throw new Error('Diese Umfrage kann nicht gelöscht werden, da für sie bereits abgestimmt wurde.');
        }

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

        await PollGroups.destroy({
            where: { pollId },
            transaction,
        });

        // Delete associated image
        if (poll.imageUrl) {
            const imagePath = path.join(__dirname, '../uploads', path.basename(poll.imageUrl));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Deleted image: ${imagePath}`);
            } else {
                console.log('Image file not found, skipping deletion.');
            }
        }


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
