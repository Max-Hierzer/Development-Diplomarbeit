// app.js
const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./models'); // Import sequelize and testConnection
const Message = require('./models/message'); // Import the Message model
const User = require('./models/user'); // Import the User model
// const userRoutes = require('./routes/userRoutes');

sequelize.sync({ alter: true })
.then(() => {
    console.log("Database & tables created!");
});

const app = express();
app.use(cors());
app.use(express.json());
// app.use('/api', userRoutes);

// Route to fetch all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.findAll(); // Fetch all messages from the database
        res.status(200).json(messages); // Send the messages as a response
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a new message
app.post('/api/message', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Message text is required' });
        }
        const newMessage = await Message.create({ text });
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error inserting message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
