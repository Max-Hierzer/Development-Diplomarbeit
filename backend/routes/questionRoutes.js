const express = require('express');
const { handleCreateQuestion, handleFetchQuestions } = require('../controllers/questionController');

const router = express.Router();


const postQuestion = router.post('/question', handleCreateQuestion);
const getQuestions = router.get('/questions', handleFetchQuestions);
module.exports = {
    postQuestion: postQuestion,
    getQuestions: getQuestions
};
