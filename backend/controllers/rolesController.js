const rolesService = require('../services/rolesServices');

const getAllRoles = async (req, res) => {
  try {
    const roles = await rolesService.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

const getRoleById = async (req, res) => {
  const roleId = req.params.id;
  try {
    const role = await rolesService.getRoleById(roleId);
    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ error: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch role' });
  }
};

module.exports = { getAllRoles, getRoleById };