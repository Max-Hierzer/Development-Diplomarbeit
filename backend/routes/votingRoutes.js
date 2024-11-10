// routes/votingRoutes.js
const express = require('express');
const router = express.Router();
const { handleVote } = require('../controllers/votingController'); // Ensure `handleVote` matches exactly

// Use the correct function name for the route
router.post('/vote', handleVote);

module.exports = router;
