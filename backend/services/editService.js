const { Polls, Questions, QuestionTypes, Answers, UserAnswers } = require('../models');

const editService = {
    async updatePoll(data) {
        const poll = await Polls.findByPk(data.pollId);
        if (!poll) throw new Error('Poll not found');

        const hasVotes = await UserAnswers.findOne({
            include: {
                model: Questions,
                where: { pollId: data.pollId },
            },
        });

        if (hasVotes) {
            throw new Error('Poll cannot be edited as it has already been voted on');
        }

        // Update poll name
        const pollPublishDate = new Date(data.publishDate);
        const pollEndDate = new Date(data.endDate);

        await Polls.update({ name: data.pollName, description: data.pollDescription, public: data.isPublic, anonymous: data.isAnonymous, publish_date: pollPublishDate, end_date: pollEndDate }, { where: { id: data.pollId } });

        console.log('Poll updated successfully');

        // Get all existing questions for this poll
        const existingQuestions = await Questions.findAll({
            where: { pollId: data.pollId },
            include: [{ model: Answers }],
        });

        // Process incoming questions
        for (const question of data.Questions) {

            const questionType = await QuestionTypes.findOne({
                    where: { name: question.type },
            });

            if (question.id) {
                // Update existing question
                const existingQuestion = await Questions.findByPk(question.id, {
                    include: [{ model: Answers }]
                });

                if (existingQuestion) {
                    await existingQuestion.update({ name: question.name, typeId: questionType.id });

                    // Update or add answers
                    const existingAnswers = existingQuestion.Answers;
                    const incomingAnswers = question.Answers;
                    console.log(existingQuestion);
                    // Create a map of existing answers for quick lookup
                    const existingAnswersMap = new Map(
                        existingAnswers.map((answer) => [answer.id, answer])
                    );

                    // Process incoming answers
                    for (const incomingAnswer of incomingAnswers) {
                        if (incomingAnswer.id && existingAnswersMap.has(incomingAnswer.id)) {
                            // Update existing answer
                            const answerToUpdate = existingAnswersMap.get(incomingAnswer.id);
                            await answerToUpdate.update({ name: incomingAnswer.name });
                        } else {
                            // Create new answer and associate
                            const newAnswer = await Answers.create({ name: incomingAnswer.name });
                            await existingQuestion.addAnswer(newAnswer);
                        }
                    }

                    // Remove answers that are not in the incoming data
                    const incomingAnswerIds = incomingAnswers.map((a) => a.id).filter(Boolean);
                    for (const existingAnswer of existingAnswers) {
                        if (!incomingAnswerIds.includes(existingAnswer.id)) {
                            await existingAnswer.destroy();
                        }
                    }
                }
            } else {
                // Create new question and associate answers
                const newQuestion = await Questions.create({
                    name: question.name,
                    pollId: data.pollId,
                    typeId: questionType.id
                });

                for (const answer of question.Answers) {
                    const newAnswer = await Answers.create({ name: answer.name });
                    await newQuestion.addAnswer(newAnswer);
                }
            }
        }

        // Delete questions that are in the database but not in the incoming data
        const incomingQuestionIds = data.Questions.map((q) => q.id).filter(Boolean);
        const questionsToDelete = existingQuestions.filter(
            (q) => !incomingQuestionIds.includes(q.id)
        );

        for (const question of questionsToDelete) {
            await question.destroy(); // Delete the question and associated answers (cascade)
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
