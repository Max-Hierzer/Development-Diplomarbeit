const express = require('express');
const { handleFetchGroups, handleFetchGroupUsers, handleEditGroups } = require('../controllers/groupController');

const router = express.Router();

const getGroups = router.get('/', handleFetchGroups);
const getGroupUsers = router.get('/users/:id', handleFetchGroupUsers)
const editGroups = router.put('/edit', handleEditGroups)

module.exports = { getGroups, getGroupUsers, editGroups };
