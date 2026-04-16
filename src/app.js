const express = require('express');
const userRoutes = require('./routes/userRoutes');

// Create the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Important: Doing this require here ensures our redis client connects when app starts
require('./redisClient');

// Basic middleware to parse JSON (though we don't strictly need it for GET requests)
app.use(express.json());

// Main home route with some helpful links
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; padding: 20px;">
            <h1>🚀 Redis Caching Demo</h1>
            <p>Welcome to the learning project! Open your terminal side-by-side to see the logs.</p>
            <h3>Endpoints to test:</h3>
            <ul>
                <li><a href="/users/no-cache" target="_blank">GET /users/no-cache</a> - 🐢 Slow API (No Redis)</li>
                <li><a href="/users/cache" target="_blank">GET /users/cache</a> - ⚡ Fast API (With Redis Cache)</li>
            </ul>
        </div>
    `);
});

// Register our User Routes
app.use('/users', userRoutes);

// Start the Express server
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`=========================================\n`);
});
