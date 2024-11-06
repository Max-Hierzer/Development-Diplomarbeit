const express = require('express');
const { handleCreateMessage } = require('../controllers/messageController');
const { handleFetchMessages } = require('../controllers/messageController');

const router = express.Router();


const postMessages = router.post('/message', handleCreateMessage);
const getMessages = router.get('/messages', handleFetchMessages);
module.exports = {
    postMessages: postMessages,
    getMessages: getMessages
};
