const express = require('express');
const { handleFetchPollId } = require('../controllers/idController');

const router = express.Router();


router.get('/pollId', handleFetchPollId);

module.exports = router;
