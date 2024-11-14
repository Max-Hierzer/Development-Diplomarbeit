const express = require('express');
const { handleCreateAnswer, handleFetchAnswers } = require('../controllers/answerController');

const router = express.Router();


const postAnswer = router.post('/answer', handleCreateAnswer);
const getAnswers = router.get('/answers', handleFetchAnswers);
module.exports = {
    postAnswer: postAnswer,
    getAnswers: getAnswers
};
