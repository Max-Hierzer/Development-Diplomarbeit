const Message = require('../models/message');

async function createMessage(text) {
    try {
        const message = await Message.create({ text });
        return message;
    } catch (error) {
        console.error('Error creating message in service:', error);
        throw error;
    }
}

async function fetchMessages() {
    try {
        const messages = await Message.findAll();
        return messages;
    } catch (error) {
        console.error('Error fetching message in service:', error);
        throw error;
    }

}

module.exports = {
    createMessage: createMessage,
    fetchMessages: fetchMessages
};
