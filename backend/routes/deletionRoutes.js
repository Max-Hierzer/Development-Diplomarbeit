// routes/deletionRoutes.js

const express = require('express');
const { deletePoll } = require('../controllers/deletionController');

const router = express.Router();

// Route to delete a poll
router.delete('/polls/:pollId', deletePoll);

module.exports = router;
