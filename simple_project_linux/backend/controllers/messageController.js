const { createMessage } = require('../services/messageServices');
const { fetchMessages } = require('../services/messageServices');

async function handleCreateMessage(req, res) {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Message text is required' });
        }
        const newMessage = await createMessage(text);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error inserting message:', error);
        res.status(500).json({error: 'Error creating message in controller' });
    }
}

async function handleFetchMessages(req, res) {
    try {
        const messages = await fetchMessages();
        res.status(200).json(messages); // Send the messages as a response
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages in controller' });
    }
}

module.exports = {
    handleCreateMessage: handleCreateMessage,
    handleFetchMessages: handleFetchMessages
}
