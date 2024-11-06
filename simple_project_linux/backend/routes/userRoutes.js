// routes/userRoutes.js
const express = require('express');
const { handleCreateUser } = require('../controllers/userController');
const router = express.Router();

router.post('/api/users', handleCreateUser);

module.exports = router;
