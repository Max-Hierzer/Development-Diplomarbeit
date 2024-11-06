// routes/userRoutes.js
const express = require('express');
const { handleCreateUser, handleFetchLoginData } = require('../controllers/userController');

const router = express.Router();

const postUser = router.post('/user', handleCreateUser);
const getLoginData = router.get('/users', handleFetchLoginData);
module.exports = {
    postUser: postUser,
    getLoginData: getLoginData
};
