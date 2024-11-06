// app.js
const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./models'); // Import sequelize and testConnection
const userRoutes = require('./routes/userRoutes');
const { postMessages } = require('./routes/messageRoutes');
const { getMessages } = require('./routes/messageRoutes');

sequelize.sync({ alter: true })
.then(() => {
    console.log("Database & tables created!");
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

app.use('api', getMessages);
// Route to add a new message
app.use('/api', postMessages);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
