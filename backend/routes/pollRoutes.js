const express = require('express');
const { handleCreatePoll } = require('../controllers/pollController');

const router = express.Router();


const postPoll = router.post('/poll', handleCreatePoll);
//const getPolls = router.get('/polls', handleFetchPolls);
module.exports = {
    postPoll: postPoll
};
