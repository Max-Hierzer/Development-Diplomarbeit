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

module.exports = { createMessage };
