const express = require('express');
const { handleFetchGroups } = require('../controllers/groupController');

const router = express.Router();

const getGroups = router.get('/', handleFetchGroups);

module.exports = { getGroups };
