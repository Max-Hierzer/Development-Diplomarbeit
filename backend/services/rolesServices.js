const { Roles } = require('../models'); 

const getAllRoles = async () => {
  return await Roles.findAll();
};

const getRoleById = async (roleId) => {
  return await Roles.findByPk(roleId);
};

module.exports = { getAllRoles, getRoleById };