const User = require('../models/user');

async function createUser(name, email, password) {
    try {
        const user = await User.create({ name, email, password });
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

module.exports = { createUser };
