const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./models'); // Import sequelize and testConnection
const { postUser, getLogin } = require('./routes/userRoutes');
const { postMessages, getMessages } = require('./routes/messageRoutes');
const { getResults, getPolls } = require('./routes/resultsRoutes');
const votingRoutes = require('./routes/votingRoutes');



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
app.use('/results', getResults);
app.use('/results', getPolls);
app.use('/api', votingRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {                            // listens for requests on port
    console.log(`Server running on port ${PORT}`);
});
