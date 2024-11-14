const { createAnswer, fetchAnswers } = require('../services/answerServices');

async function handleCreateAnswer(req, res) {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Answer text is required' });
        }
        const newAnswer = await createAnswer(name);
        res.status(201).json(newAnswer);
    } catch (error) {
        console.error('Error inserting answers:', error);
        res.status(500).json({error: 'Error creating answer in controller' });
    }
}

async function handleFetchAnswers(req, res) {
    try {
        const answers = await fetchAnswers();
        res.status(200).json(answers); // Send the answers as a response
    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({ error: 'Error fetching answers in controller' });
    }
}

module.exports = {
    handleCreateAnswer: handleCreateAnswer,
    handleFetchAnswers: handleFetchAnswers
}
