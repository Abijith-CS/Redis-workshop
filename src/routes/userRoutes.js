const express = require('express');
const router = express.Router();
const { fetchUsersFromDB } = require('../db');
const redisClient = require('../redisClient');

/**
 * 1. API WITHOUT Redis (Slow)
 * Endpoint: GET /users/no-cache
 * Behavior: Always goes to the Database. It will always take ~2 seconds.
 */
router.get('/no-cache', async (req, res) => {
    console.time('no-cache-request'); // Start high-resolution timer
    
    try {
        console.log('\n🔵 GET /users/no-cache called');
        
        // Every single request fetches from the slow database
        const users = await fetchUsersFromDB();
        
        console.timeEnd('no-cache-request'); // Stop timer and print duration
        res.json({
            source: 'Database',
            data: users
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

/**
 * 2. API WITH Redis (Cache Aside Strategy)
 * Endpoint: GET /users/cache
 * Behavior:
 *    - First, checks Redis Cache.
 *    - If data is in cache -> Return immediately (Super Fast!)
 *    - If not in cache -> Fetch from DB (Slow), Save to Cache, Return data.
 */
router.get('/cache', async (req, res) => {
    console.time('cache-request'); // Start high-resolution timer
    const cacheKey = 'users';

    try {
        console.log('\n🟢 GET /users/cache called');
        
        // 1. Check if we have the data in Redis first
        console.log(`    [Cache] 🔍 Checking Redis for key: "${cacheKey}"...`);
        const cachedData = await redisClient.get(cacheKey);

        // 2. If it exists in Redis -> CACHE HIT
        if (cachedData) {
            console.log('    [Cache] ⚡ CACHE HIT! Returning data from Redis immediately.');
            console.timeEnd('cache-request');
            
            return res.json({
                source: 'Redis Cache',
                data: JSON.parse(cachedData) // Parse string back to Object
            });
        }

        // 3. If it does not exist in Redis -> CACHE MISS
        console.log('    [Cache] 🐢 CACHE MISS! Data not found in Redis.');
        
        // Go fetch it from the slow Database
        const users = await fetchUsersFromDB();

        // Save the result to Redis so the NEXT request is fast
        // - We use JSON.stringify because Redis stores strings natively
        // - EX: 60 sets an expiration time of 60 seconds (TTL)
        console.log(`    [Cache] 💾 Saving data to Redis with key: "${cacheKey}" for 60 seconds...`);
        await redisClient.set(cacheKey, JSON.stringify(users), {
            EX: 120 
        });

        console.timeEnd('cache-request');
        
        // Return the fresh data
        res.json({
            source: 'Database (and saved to Cache)',
            data: users
        });

    } catch (error) {
        console.error("Error in cache route:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
