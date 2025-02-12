const express = require('express');
const { handleFetchResults, handleFetchPolls, handleFetchResultData } = require('../controllers/resultsController');

const router = express.Router();

// give api names
const getResults = router.post('/results', handleFetchResults);
const getResultData = router.post('/data', handleFetchResultData);
const getPolls = router.get('/polls', handleFetchPolls);

module.exports = { getResults, getPolls, getResultData };
