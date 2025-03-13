const { createUser, fetchUsers, fetchLogin, sendEmail } = require('../services/userServices');

// resolves api connection with frontend for the registration of user
async function handleCreateUser(req, res) {
    try {
        const { token, name, password } = req.body;                 // gives the data names
        const newUser = await createUser(token, name, password);    // passes new users data to service
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

async function handleSendEmail(req, res) {
    try {
        const { firstName, lastName, email, roleId } = req.body;
        if (!email || !firstName || !lastName) {
            return res.status(400).json({ error: "Keine E-Mail-Adresse angegeben" });
        }

        const emailData = await sendEmail(firstName, lastName, email, roleId);

        if (!emailData.success) {
            return res.status(401).json({ message: emailData.message });
        }

        res.status(200).json(emailData);                                // passes the data to frontend
    } catch (error) {
        console.error('Error fetching userData:', error);
        res.status(500).json({error: 'Error fetching userData in controller'});
    }
}

module.exports = {
    handleCreateUser: handleCreateUser,
    handleFetchUsers: handleFetchUsers,
    handleFetchLogin: handleFetchLogin,
    handleSendEmail: handleSendEmail
}
