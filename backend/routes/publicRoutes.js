// routes/pollRoutes.js
const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/all', publicController.handleFetchAll);

module.exports = router;
