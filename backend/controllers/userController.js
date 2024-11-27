const { createUser, fetchLogin } = require('../services/userServices');

// resolves api connection with frontend for the registration of user
async function handleCreateUser(req, res) {
    try {
        const { name, email, password } = req.body;                 // gives the data names
        const newUser = await createUser(name, email, password);    // passes new users data to service
        res.status(201).json(newUser);                              // response
    } catch (error) {
        res.status(500).json({error: 'Error creating user in controller' });
    }
}

// resolves api connection with frontend for to give login data
async function handleFetchLogin(req, res) {
    try {
        const login = await fetchLogin();                           // gets the data from service
        res.status(200).json(login);                                // passes the data to frontend
    } catch (error) {
        console.error('Error fetching userData:', error);
        res.status(500).json({error: 'Error fetching userData in controller'});
    }
}

module.exports = {
    handleCreateUser: handleCreateUser,
    handleFetchLogin: handleFetchLogin
}
