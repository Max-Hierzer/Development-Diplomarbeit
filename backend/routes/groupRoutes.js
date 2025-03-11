const express = require('express');
const { handleFetchGroups, handleFetchUsers, handleFetchGroupUsers, handleEditGroups, handleAddUsersToGroup, handleCreateGroup, handleDelete, handleFetchPollGroups, handleAddPollGroups, handleDeleteGroupUsers, handleDelPollGroups } = require('../controllers/groupController');

const router = express.Router();

const getGroups = router.get('/', handleFetchGroups);
const getAllUsers = router.get('/users', handleFetchUsers)
const getGroupUsers = router.get('/users/:id', handleFetchGroupUsers)
const editGroups = router.put('/edit', handleEditGroups)
const addUsers = router.post('/users', handleAddUsersToGroup)
const createGroup = router.post('/create', handleCreateGroup);
const deleteGroup = router.delete('/delete', handleDelete);
const getPollGroups = router.get('/polls/:id', handleFetchPollGroups);
const addPollGroups = router.post('/polls', handleAddPollGroups);
const deleteGroupUsers = router.delete('/users', handleDeleteGroupUsers);
const delPollGroups = router.delete('/polls', handleDelPollGroups);

module.exports = { getGroups, getAllUsers, getGroupUsers, editGroups, addUsers, createGroup, deleteGroup, getPollGroups, addPollGroups, deleteGroupUsers, delPollGroups };
