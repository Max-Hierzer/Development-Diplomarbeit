const { createUser } = require('../services/userServices');

async function handleCreateUser(req, res) {
    try {
        const {name, email, password } = req.body;
        const newUser = await createUser(name, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: 'Error creating user' });
    }
}

module.exports = { handleCreateUser }
