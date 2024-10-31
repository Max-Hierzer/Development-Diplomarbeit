const express = require('express');
const sequelize = require('./config/database');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Hello World from Express!');
});
  
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();