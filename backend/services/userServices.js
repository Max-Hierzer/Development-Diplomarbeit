const { Users, Roles } = require('../models/index');

// writing new user data in database
async function createUser(name, email, password, roleId) {
    try {
        const user = await Users.create({ name, email, password, roleId }); // creates new user with attributes name, email, password
        return user;
    } catch (error) {
        console.error('Error creating user in service:', error);
        throw error;
    }
}

// getting login data from database
async function fetchLogin() {
    try {
        const users = await Users.findAll({                 // getting data from Users
                attributes: ['id', 'name', 'password']      // getting attributes id, name, password
            });
        return users;
    } catch (error) {
        console.error('Error fetching users in service:', error);
        throw error;
    }
}

module.exports = {
    createUser: createUser,
    fetchLogin: fetchLogin
};
