const express = require('express');
const { handleFetchResults } = require('../controllers/resultsController');

const router = express.Router();

const getResults = router.get('/results', handleFetchResults);

module.exports = getResults;
