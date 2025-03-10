const express = require('express');
const { handleFetchGroups, handleEditGroups } = require('../controllers/groupController');

const router = express.Router();

const getGroups = router.get('/', handleFetchGroups);
const editGroups = router.put('/edit', handleEditGroups)

module.exports = { getGroups, editGroups };
