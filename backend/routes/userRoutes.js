// routes/userRoutes.js
const express = require('express');
const { handleCreateUser, handleFetchUsers, handleFetchLogin } = require('../controllers/userController');

const router = express.Router();

// give api names
const postUser = router.post('/user', handleCreateUser);
const getUsers = router.get('/users', handleFetchUsers);
const getLogin = router.post('/login', handleFetchLogin);
module.exports = {
    postUser: postUser,
    getUsers: getUsers,
    getLogin: getLogin
};
