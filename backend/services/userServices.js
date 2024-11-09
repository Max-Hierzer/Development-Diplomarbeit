const { Users } = require('../models/index');

async function createUser(name, email, password) {
    try {
        const user = await Users.create({ name, email, password });
        return user;
    } catch (error) {
        console.error('Error creating user in service:', error);
        throw error;
    }
}

async function fetchLogin() {
    try {
        const users = await Users.findAll({
                attributes: ['id', 'name', 'password']
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
