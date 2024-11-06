const express = require('express');
const { handleCreateMessage } = require('../controllers/messageControler');
const router = express.Router();

router.post('/message', handleCreateMessage);

module.exports = router;
