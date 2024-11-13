const Message = require('../models/message');

// writing data from message in database
async function createMessage(text) {
    try {
        const message = await Message.create({ text }); // create new message
        return message;
    } catch (error) {
        console.error('Error creating message in service:', error);
        throw error;
    }
}

// getting selected data from messages
async function fetchMessages() {
    try {
        const messages = await Message.findAll();   //  gett all messages
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
