// routes/votingRoutes.js
const express = require('express');
const { handleVote, handlePublicVote, handleAnonymousVote } = require('../controllers/votingController');

const router = express.Router();

// give api names
router.post('/vote', handleVote);
router.post('/vote/public', handlePublicVote);
router.post('/vote/anonymous', handleAnonymousVote);

module.exports = router;
