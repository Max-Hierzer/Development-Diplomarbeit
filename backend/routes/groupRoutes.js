const express = require('express');
const { handleFetchGroups, handleFetchUsers, handleFetchGroupUsers, handleEditGroups, handleAddUsersToGroup, handleRemoveUser, handleCreateGroup } = require('../controllers/groupController');

const router = express.Router();

const getGroups = router.get('/', handleFetchGroups);
const getAllUsers = router.get('/users', handleFetchUsers)
const getGroupUsers = router.get('/users/:id', handleFetchGroupUsers)
const editGroups = router.put('/edit', handleEditGroups)
const addUsers = router.post('/users/add', handleAddUsersToGroup)
const removeUser = router.delete('/users/remove', handleRemoveUser)
const createGroup = router.post('/create', handleCreateGroup);

module.exports = { getGroups, getAllUsers, getGroupUsers, editGroups, addUsers, removeUser, createGroup };
