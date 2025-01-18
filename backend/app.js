const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./models'); // Import sequelize and testConnection
const { postUser, getLogin } = require('./routes/userRoutes');
const { postMessages, getMessages } = require('./routes/messageRoutes');
const { postPoll } = require('./routes/pollRoutes');
const { postQuestion, getQuestions } = require('./routes/questionRoutes');
const { postAnswer, getAnswers } = require('./routes/answerRoutes');
const { getResults, getPolls } = require('./routes/resultsRoutes');
const votingRoutes = require('./routes/votingRoutes');
const deletionRoutes = require('./routes/deletionRoutes');
const editRoutes = require('./routes/editRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const csvExportRoutes = require('./routes/csvExportRoutes');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

sequelize.sync({ alter: true })
.then(() => {
    console.log("Database & tables created!");
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', postUser);
app.use('/api', getLogin);
app.use('/api', getMessages);
app.use('/api', postMessages);
app.use('/api', postPoll);
app.use('/api', getPolls);
app.use('/api', postQuestion);
app.use('/api', getQuestions);
app.use('/api', postAnswer);
app.use('/api', getAnswers);
app.use('/results', getResults);
app.use('/results', getPolls);
app.use('/api', votingRoutes);
app.use('/api', deletionRoutes);
app.use('/api', editRoutes);
app.use('/api', rolesRoutes);
app.use('/api', csvExportRoutes);

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {                            // listens for requests on port
    console.log(`Server running on port ${PORT}`);
});
