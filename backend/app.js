const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./models'); // Import sequelize and testConnection
const { postUser, getUsers, getLogin, postEmail } = require('./routes/userRoutes');
const { postMessages, getMessages } = require('./routes/messageRoutes');
const { postPoll, getPoll } = require('./routes/pollRoutes');
const { getResults, getPolls, getResultData } = require('./routes/resultsRoutes');
const { getGroups, getAllUsers, getGroupUsers, editGroups, addUsers, createGroup, deleteGroup, getPollGroups, addPollGroups, deleteGroupUsers, delPollGroups } = require('./routes/groupRoutes');
const votingRoutes = require('./routes/votingRoutes');
const deletionRoutes = require('./routes/deletionRoutes');
const editRoutes = require('./routes/editRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const csvExportRoutes = require('./routes/csvExportRoutes');
const imageRoutes = require('./routes/imageRoutes');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const publicRoutes = require('./routes/publicRoutes');
require('dotenv').config();

sequelize.sync({ alter: true })
.then(() => {
    console.log("Database & tables created!");
});


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', postUser);
app.use('/api', getUsers);
app.use('/api', getLogin);
app.use('/api', postEmail);
app.use('/api', getMessages);
app.use('/api', postMessages);
app.use('/api', postPoll);
app.use('/api', getPolls);
app.use('/results', getResults);
app.use('/results', getResultData);
app.use('/results', getPolls);
app.use('/api', votingRoutes);
app.use('/api', deletionRoutes);
app.use('/api', editRoutes);
app.use('/api', rolesRoutes);
app.use('/api', csvExportRoutes);
app.use('/api', imageRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/groups', getGroups);
app.use('/groups', getGroupUsers);
app.use('/groups', editGroups);
app.use('/groups', getAllUsers);
app.use('/groups', addUsers);
app.use('/groups', createGroup);
app.use('/groups', deleteGroup);
app.use('/groups', getPollGroups);
app.use('/groups', addPollGroups);
app.use('/groups', deleteGroupUsers);
app.use('/groups', delPollGroups);
app.use('/api', getPoll);
app.use('/public', publicRoutes);

app.post('/verify-recaptcha', async (req, res) => {
    const { token } = req.body;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
        });
        const data = await response.json();

        if (data.success && data.score > 0.5) {
            // Validation successful
            res.json({ success: true });
        } else {
            // Validation failed
            res.json({ success: false, message: 'Verification failed' });
        }
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {                            // listens for requests on port
    console.log(`Server running on port ${PORT}`);
});
