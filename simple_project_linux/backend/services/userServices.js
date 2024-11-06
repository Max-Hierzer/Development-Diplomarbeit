const User = require('../models/user');

async function createUser(name, email, password) {
    try {
        const user = await User.create({ name, email, password });
        return user;
    } catch (error) {
        console.error('Error creating user in service:', error);
        throw error;
    }
}

async function fetchLoginData() {
    try {
        const users = await User.findAll({
            attributes: ['name', 'password']
        });
        return users;
    } catch (error) {
        console.error('Error fetching users in service:', error);
        throw error;
    }
}

module.exports = {
    createUser: createUser,
    fetchLoginData: fetchLoginData
};