const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

// Get all roles
router.get('/roles', rolesController.getAllRoles);

// Get a specific role by ID
router.get('/roles/:id', rolesController.getRoleById);

module.exports = router;