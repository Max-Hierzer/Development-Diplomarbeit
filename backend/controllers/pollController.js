const { createPoll, getPolls } = require('../services/pollServices');

async function handleCreatePoll(req, res) {
    try {
        console.log('Request Body:', req.body);
        const { poll, questions, publicQuestions, selectedGroups } = req.body;
        console.log('Image URL from request:', poll.imageUrl);

        const imageUrl = poll.imageUrl || null;
        console.log('imageUrl in controller:', imageUrl);

        if (!poll.name) {
            return res.status(400).json({ error: 'Poll name is required' });
        }
        if (!poll.publishDate) {
            return res.status(400).json({ error: 'Poll publish date is required' });
        }
        if (!poll.endDate) {
            return res.status(400).json({ error: 'Poll end Date is required' });
        }

        if (!questions[0].name) {
            return res.status(400).json({ error: 'At least one question is required' });
        }

        for (const question of questions) {
            if (!question.name) {
                return res.status(400).json({ error: 'Each question must have a valid name' });
            }

            if (!question|| questions.length === 0 || !questions[0].name) {
                return res.status(400).json({ error: `Question "${question.name}" must have at least one answer` });
            }

            for (const answer of question.answers) {
                if (!answer.name) {
                    return res.status(400).json({ error: `All answers for question "${question.name}" must have a valid name` });
                }
            }
        }

        if (publicQuestions && publicQuestions.length > 0) {
            for (const question of publicQuestions) {
                if (!question.name) {
                    return res.status(400).json({ error: 'Each public question must have a valid name' });
                }

                if (!question.PublicAnswers || question.PublicAnswers.length === 0) {
                    return res.status(400).json({ error: `Public question "${question.name}" must have at least one answer` });
                }

                for (const answer of question.PublicAnswers) {
                    if (!answer.name) {
                        return res.status(400).json({ error: `All answers for public question "${question.name}" must have a valid name` });
                    }
                }
            }
        }

        const newPoll = await createPoll(poll, questions, imageUrl, publicQuestions, selectedGroups);
        res.status(201).json(newPoll);
    } catch (error) {
        console.error('Error creating poll:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleGetPolls(req, res) {
    try {
        const polls = await getPolls(req.params.id);
        res.status(200).json(polls);
    } catch (error) {
        console.error('Error fetching Polls in Controller: ', error)
        res.status(500).json({error: 'Error fetching Polls: ', error})
    }
}

module.exports = {
    handleCreatePoll: handleCreatePoll,
    handleGetPolls: handleGetPolls
}
