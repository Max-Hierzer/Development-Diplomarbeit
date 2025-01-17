// routes/userRoutes.js
const express = require('express');
const { handleCreateUser, handleFetchLogin } = require('../controllers/userController');

const router = express.Router();

// give api names
const postUser = router.post('/user', handleCreateUser);
const getLogin = router.get('/users', handleFetchLogin);
module.exports = {
    postUser: postUser,
    getLogin: getLogin
};
