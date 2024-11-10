// routes/votingRoutes.js
const express = require('express');
const router = express.Router();
const { submitVote } = require('../controllers/votingController');

// Route to submit a vote
router.post('/vote', submitVote);

module.exports = router;
