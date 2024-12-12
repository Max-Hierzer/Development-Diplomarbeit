// routes/pollRoutes.js
const express = require('express');
const editController = require('../controllers/editController');

const router = express.Router();

router.put('/polls/:id', editController.updatePoll);

module.exports = router;
