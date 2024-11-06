const express = require('express');
const { handleCreateMessage } = require('../controllers/messageController');
const router = express.Router();

router.post('/message', handleCreateMessage);

module.exports = router;
