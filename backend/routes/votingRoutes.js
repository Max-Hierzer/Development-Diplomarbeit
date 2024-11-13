// routes/votingRoutes.js
const express = require('express');
const { handleVote } = require('../controllers/votingController');

const router = express.Router();

// give api names
router.post('/vote', handleVote);

module.exports = router;
