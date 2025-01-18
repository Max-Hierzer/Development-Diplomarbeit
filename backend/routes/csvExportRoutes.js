const express = require('express');
const { exportPollResults } = require('../controllers/csvExportController');

const router = express.Router();

router.get('/export/:pollId', exportPollResults);

module.exports = router;
