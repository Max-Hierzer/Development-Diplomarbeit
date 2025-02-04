const { Users, Roles } = require('../models/index');
const bcrypt = require('bcrypt');

// writing new user data in database
async function createUser(name, email, password, roleId) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await Users.create({ name, email, password: hashedPassword, roleId }); // creates new user with attributes name, email, password
        return user;
    } catch (error) {
        console.error('Error creating user in service:', error);
        throw error;
    }
}

// getting login data from database
async function fetchLogin(username, password) {
    try {
        const user = await Users.findOne({
            where: {name: username},
            include: [{ model: Roles, attributes: ['id', 'name'] }]
        });

        if (!user) {
            return { success: false, message: "Invalid username or password" };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { success: false, message: "Invalid username or password" };
        }

        return {
            success: true,
            userId: user.id,
            username: user.name,
            roleId: user.roleId,
            roleName: user.Role.name
        };
    } catch (error) {
        console.error('Error fetching user in service:', error);
        throw error;
    }
}

module.exports = {
    createUser: createUser,
    fetchLogin: fetchLogin
};
