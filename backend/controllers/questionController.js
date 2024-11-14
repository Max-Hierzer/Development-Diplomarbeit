const { createQuestion, fetchQuestions } = require('../services/questionServices');

async function handleCreateQuestion(req, res) {
    try {
        const { name, pollId } = req.body;
        if (!name || !pollId) {
            return res.status(400).json({ error: 'Question text and poll id are required' });
        }
        const newQuestion = await createQuestion(name,pollId);
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Error inserting question:', error);
        res.status(500).json({error: 'Error creating question in controller' });
    }
}

async function handleFetchQuestions(req, res) {
    try {
        const questions = await fetchQuestions();
        res.status(200).json(questions); // Send the questions as a response
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Error fetching questions in controller' });
    }
}

module.exports = {
    handleCreateQuestion: handleCreateQuestion,
    handleFetchQuestions: handleFetchQuestions
}
