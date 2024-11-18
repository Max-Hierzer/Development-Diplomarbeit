const { createPoll } = require('../services/pollServices');

async function handleCreatePoll(req, res) {
    try {
        const { poll, questions } = req.body;

        if (!poll.name) {
            return res.status(400).json({ error: 'Poll name is required' });
        }

        if (!questions[0].name) {
            return res.status(400).json({ error: 'At least one question is required' });
        }

        for (const question of questions) {
            if (!question.name) {
                return res.status(400).json({ error: 'Each question must have a valid name' });
            }

            if (!question.answers[0].name) {
                return res.status(400).json({ error: `Question "${question.name}" must have at least one answer` });
            }

            for (const answer of question.answers) {
                if (!answer.name) {
                    return res.status(400).json({ error: `All answers for question "${question.name}" must have a valid name` });
                }
            }
        }

        const newPoll = await createPoll(poll, questions);
        res.status(201).json(newPoll);
    } catch (error) {
        console.error('Error creating poll:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    handleCreatePoll: handleCreatePoll
}
