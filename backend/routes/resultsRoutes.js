const express = require('express');
const { handleFetchResults, handleFetchPolls } = require('../controllers/resultsController');

const router = express.Router();

const getResults = router.get('/results', handleFetchResults);
const getPolls = router.get('/polls', handleFetchPolls);

module.exports = { getResults, getPolls };
