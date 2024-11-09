const { createUser, fetchLogin } = require('../services/userServices');

async function handleCreateUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const newUser = await createUser(name, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: 'Error creating user in controller' });
    }
}

async function handleFetchLogin(req, res) {
    try {
        const login = await fetchLogin();
        res.status(200).json(login);
    } catch (error) {
        console.error('Error fetching userData:', error);
        res.status(500).json({error: 'Error fetching userData in controller'});
    }
}

module.exports = {
    handleCreateUser: handleCreateUser,
    handleFetchLogin: handleFetchLogin
}
