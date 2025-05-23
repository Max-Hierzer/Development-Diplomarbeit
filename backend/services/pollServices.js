const { Polls: Poll } = require('../models');
const { Questions: Question } = require('../models');
const { QuestionTypes: QuestionType } = require('../models');
const { Answers: Answer } = require('../models');
const { sequelize } = require('../models');
const { PollGroups, Groups, UserGroups, Users, PublicQuestions, PublicAnswers, PublicPollQuestions } = require('../models');

async function createPoll(poll, questions, imageUrl, publicQuestions, groups) {
    const transaction = await sequelize.transaction();
    try {
        console.log('Poll in createPoll:', poll);
        console.log('Questions in createPoll:', questions);
        console.log('Image URL in createPoll:', imageUrl);
        const pollPublishDate = new Date(poll.publishDate);
        const pollEndDate = new Date(poll.endDate);
        
        const createdPoll = await Poll.create({ 
            name: poll.name, 
            description: poll.description, 
            user_id: poll.userId, 
            public: poll.public, 
            anonymous: poll.anon, 
            publish_date: pollPublishDate, 
            end_date: pollEndDate,
            imageUrl: imageUrl
        }, { transaction });
        const createdQuestions = [];
        for (const question of questions) {
            const questionType = await QuestionType.findOne({
                where: { name: question.type },
            });
            const createdQuestion = await Question.create({
                name: question.name,
                pollId: createdPoll.id,
                typeId: questionType.id,
            }, { transaction });

            const createdAnswers = [];
            for (const answer of question.answers) {
                const [createdAnswer] = await Answer.findOrCreate({
                    where: { name: answer.name },
                    transaction
                });
                createdAnswers.push(createdAnswer);
            }

            await createdQuestion.addAnswers(createdAnswers, { transaction });

            createdQuestions.push(createdQuestion);
        }

        const createdPublicQuestions = [];
        for (const question of publicQuestions) {

            const questionType = await QuestionType.findOne({
                where: { id: question.typeId },
            });

            let [createdQuestion, created] = await PublicQuestions.findOrCreate({
                where: {
                    name: question.name,
                    typeId: questionType.id,
                },
                transaction
            });

            if (!created) {
                createdQuestion.name = question.name;
                createdQuestion.typeId = questionType.id;
                await createdQuestion.save({ transaction });
            }

            const createdAnswers = [];
            for (const answer of question.PublicAnswers) {
                const existingAnswer = await PublicAnswers.findOne({
                    where: { name: answer.name },
                });

                if (existingAnswer) {
                    if (existingAnswer.name !== answer.name) {
                        existingAnswer.name = answer.name;
                        await existingAnswer.save({ transaction });
                    }
                    createdAnswers.push(existingAnswer);
                } else {
                    const createdAnswer = await PublicAnswers.create({
                        name: answer.name,
                    }, { transaction });
                    createdAnswers.push(createdAnswer);
                }
            }

            await createdQuestion.addPublicAnswers(createdAnswers, { transaction });

            createdPublicQuestions.push(createdQuestion);

            await PublicPollQuestions.create({
                pollId: createdPoll.id,
                publicQuestionId: createdQuestion.id
            }, { transaction });
        }


        // Add groups to the poll (ensure no duplicates)
        const promises = groups.map(async (group) => {
            const g = await Groups.findByPk(group.value);
            if (!g) {
                throw new Error(`Group with ID ${g.value} not found`);
            }
            const existingPollGroup = await PollGroups.findOne({
                where: { groupId: group.value, pollId: createdPoll.id }
            });
            if (!existingPollGroup) {
                await PollGroups.create({ groupId: group.value, pollId: createdPoll.id }, { transaction });
            }
        });

        // Wait for all promises to complete
        const pollgroups = await Promise.all(promises);
        
        await transaction.commit();

        return {
            poll: createdPoll,
            questions: createdQuestions,
            publicQuestions: createdPublicQuestions,
            groups: pollgroups
        };
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating poll in service:', error);
        throw error;
    }
}

async function getPolls(userId) {
    try {
        const userGroups = await UserGroups.findAll({
            where: { userId: userId },
            include: [{ model: Groups }]
        });

        const ownedPolls = await Poll.findAll({
            where: { user_id: userId },
            attributes: ['id', 'name', 'user_id', 'public', 'anonymous', 'publish_date', 'end_date', 'description', 'imageUrl'],
                include: [
                    {
                        model: Question,
                        attributes: ['id', 'name', 'typeId'],
                        include: [
                            { model: Answer, attributes: ['id', 'name'] },
                            { model: QuestionType, attributes: ['id', 'name'], as: 'QuestionType' }
                        ]
                    }
                ]
        });
       
        

        const groupIds = userGroups.map(ug => ug.groupId);

        
        if (groupIds.length === 0 && ownedPolls.length === 0) {
            return [];
        }
        

        const pollGroups = await PollGroups.findAll({
            where: { groupId: groupIds },
            include: [
                {
                    model: Poll,
                    attributes: ['id', 'name', 'user_id', 'public', 'anonymous', 'publish_date', 'end_date', 'description', 'imageUrl'],
                    include: [
                        {
                            model: Question,
                            attributes: ['id', 'name', 'typeId'],
                            include: [
                                { model: Answer, attributes: ['id', 'name'] },
                                { model: QuestionType, attributes: ['id', 'name'], as: 'QuestionType' }
                            ]
                        }
                    ]
                }
            ]
        });

        const pollsMap = new Map();
        pollGroups.forEach(pg => {
            if (pg.Poll && !pollsMap.has(pg.Poll.id)) {
                pollsMap.set(pg.Poll.id, pg.Poll);
            }
        });

        ownedPolls.forEach(op => {
            if (!pollsMap.has(op.id)) {
                pollsMap.set(op.id, op);
            }
        });

        const polls = Array.from(pollsMap.values());
        const finished = []
        for (const poll of polls) {
            // Manually create a plain object from the poll instance
            const plainPoll = {
                id: poll.id,
                name: poll.name,
                user_id: poll.user_id,
                public: poll.public,
                    anonymous: poll.anonymous,
                    publish_date: poll.publish_date,
                    end_date: poll.end_date,
                    description: poll.description,
                    imageUrl: poll.imageUrl,
                    Questions: poll.Questions,  // Assuming Questions are included already
            };

            // Fetch publicPollQuestions related to this poll
            const publicPollQuestions = await PublicPollQuestions.findAll({
                where: { pollId: poll.id },
                include: [
                    {
                        model: PublicQuestions,
                        attributes: ['id', 'name', 'typeId'],
                        include: [
                            { model: PublicAnswers, attributes: ['id', 'name'] },
                            { model: QuestionType, attributes: ['id', 'name'], as: 'QuestionType' }
                        ]
                    }
                ],
                nest: true,
            });

            // Add publicPollQuestions to the plainPoll object
            plainPoll.publicPollQuestions = publicPollQuestions;

            // Push the serialized poll into the finished array
            finished.push(plainPoll);
        }

        return finished;
    } catch (error) {
        console.error('Error fetching polls for user:', error);
        throw error;
    }
}

module.exports = {
    createPoll,
    getPolls
};
