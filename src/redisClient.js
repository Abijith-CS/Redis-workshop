// This file sets up the connection to our Redis server
const redis = require('redis');

// Create a Redis client
// By default, it will try to connect to redis://localhost:6379
const client = redis.createClient({
    url: 'redis://localhost:6379'
});

// Setup event listeners for the Redis client to handle connection states nicely
client.on('connect', () => {
    console.log('✅ Connected to Redis Database');
});

client.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

// We need to connect the client
// connect() is an async operation, so we do it in an IIFE as soon as the file loads
(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.log("Could not connect to Redis. Is Docker running?", err);
    }
})();

module.exports = client;
