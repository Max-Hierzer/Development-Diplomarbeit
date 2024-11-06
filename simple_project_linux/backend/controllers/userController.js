const { createUser } = require('../services/userService');

async function handleCreateUser(req, res) {
    const {name, email, password } = req.body;
    try {
        const newUser = await createUser(name, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: 'Error creating user' });
    }
}

module.exports = { handleCreateUser }
