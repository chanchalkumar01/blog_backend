const express = require('express');
const connectDB = require('./config/db');

async function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    // Connect to the database
    const db = await connectDB();
    app.set('db', db);

    // Middleware to parse JSON bodies
    app.use(express.json());

    // Initialize a global router for v1 of the API
    const v1Router = require('./api/v1/routes')(db); 
    app.use('/api/v1', v1Router);

    // Simple route for the root
    app.get('/', (req, res) => {
        res.send('Welcome to the API');
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();