const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./models'); // Import sequelize and testConnection
const { postUser, getLoginData } = require('./routes/userRoutes');
const { postMessages, getMessages } = require('./routes/messageRoutes');


sequelize.sync({ alter: true })
.then(() => {
    console.log("Database & tables created!");
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', postUser);
app.use('/api', getLoginData);
app.use('api', getMessages);
app.use('/api', postMessages);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
