const { createMessage, fetchMessages } = require('../services/messageServices');

// resolves api connection with frontend for the creation of messages
async function handleCreateMessage(req, res) {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Message text is required' }); // needs to have a body to input
        }
        const newMessage = await createMessage(text);   // passes message to service
        res.status(201).json(newMessage);               // reponse message
    } catch (error) {
        console.error('Error inserting message:', error);
        res.status(500).json({error: 'Error creating message in controller' });
    }
}

// resolves api connection with frontend for the output of messages
async function handleFetchMessages(req, res) {
    try {
        const messages = await fetchMessages();         // gets messages from service
        res.status(200).json(messages);                 // Send the messages as a response
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages in controller' });
    }
}

module.exports = {
    handleCreateMessage: handleCreateMessage,
    handleFetchMessages: handleFetchMessages
}
