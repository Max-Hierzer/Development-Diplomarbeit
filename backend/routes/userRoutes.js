// routes/userRoutes.js
const express = require('express');
const { handleCreateUser, handleFetchUsers, handleFetchLogin, handleSendEmail } = require('../controllers/userController');

const router = express.Router();

// give api names
const postUser = router.put('/user', handleCreateUser);
const getUsers = router.post('/users', handleFetchUsers);
const getLogin = router.post('/login', handleFetchLogin);
const postEmail = router.post('/email', handleSendEmail);

module.exports = {
    postUser: postUser,
    getUsers: getUsers,
    getLogin: getLogin,
    postEmail: postEmail
};
