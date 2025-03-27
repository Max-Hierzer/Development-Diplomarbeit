// routes/votingRoutes.js
const express = require('express');
const { handleVote, handleAnonymousVote, checkIfVoted } = require('../controllers/votingController');

const router = express.Router();

// give api names
router.post('/vote', handleVote);
router.post('/vote/anonymous', handleAnonymousVote);
router.get('/hasVoted/:userId/:pollId', checkIfVoted);

module.exports = router;
