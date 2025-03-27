// routes/pollRoutes.js
const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/all', publicController.handleFetchAll);
router.get('/poll/:id', publicController.handleFetchPoll);
router.post('/vote', publicController.handleVote);

module.exports = router;
