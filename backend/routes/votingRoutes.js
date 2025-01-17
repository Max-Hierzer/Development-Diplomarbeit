// routes/votingRoutes.js
const express = require('express');
const { handleVote, handlePublicVote } = require('../controllers/votingController');

const router = express.Router();

// give api names
router.post('/vote', handleVote);
router.post('/vote/public', handlePublicVote)

module.exports = router;
