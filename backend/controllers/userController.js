const { createUser, fetchUsers, fetchLogin } = require('../services/userServices');

// resolves api connection with frontend for the registration of user
async function handleCreateUser(req, res) {
    try {
        const { name, email, password, roleId } = req.body;                 // gives the data names
        const newUser = await createUser(name, email, password, roleId);    // passes new users data to service
        res.status(201).json(newUser);                              // response
    } catch (error) {
        res.status(500).json({error: 'Error creating user in controller' });
    }
}

async function handleFetchUsers(req, res) {
    try {
        const { pollId, questions } = req.body;
        const users = await fetchUsers(pollId, questions);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users in Controller: ', error);
        res.status(500).json({error: 'Error fetching users in controller'});
    }
}

// resolves api connection with frontend for to give login data
async function handleFetchLogin(req, res) {
    try {
        const { username, password } = req.body;
        const loginData = await fetchLogin(username, password);

        if (!loginData.success) {
            return res.status(401).json({ message: loginData.message });
        }

        res.status(200).json(loginData);                                // passes the data to frontend
    } catch (error) {
        console.error('Error fetching userData:', error);
        res.status(500).json({error: 'Error fetching userData in controller'});
    }
}

module.exports = {
    handleCreateUser: handleCreateUser,
    handleFetchUsers: handleFetchUsers,
    handleFetchLogin: handleFetchLogin
}
