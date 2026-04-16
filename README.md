# 🚀 Node.js + Redis Caching Demo

Welcome to this beginner-friendly demo! This project clearly demonstrates the performance difference between a normal database API and a Redis-cached API.

It's designed to be simple, easy to read, and educational for your live workshop.

## 📁 Project Structure

```text
/redis-caching-demo
├── src/
│   ├── app.js               # Main Express server entry point
│   ├── db.js                # Mock database with a 2-second artificial delay
│   ├── redisClient.js       # Redis connection setup
│   └── routes/
│       └── userRoutes.js    # The API endpoints (with and without cache)
├── docker-compose.yml       # Docker config to easily run Redis locally
├── package.json             # Node dependencies
└── README.md                # You are here!
```

---

## 🛠️ Step-by-Step Setup Instructions

**Prerequisites:** Make sure you have **Node.js** and **Docker Desktop** installed on your machine.

### 1. Install Node Dependencies
Open your terminal in the project root folder and run:
```bash
npm install
```

### 2. Start the Redis Server (via Docker)
We use Docker to quickly spin up a Redis server locally without installing Redis manually.
```bash
docker-compose up -d
```
*(The `-d` flag runs Docker in the background. You should see a container named `demo-redis` start up. Redis will be exposed on port `6379`).*

### 3. Start the Express App
Run the following command to start our Node server:
```bash
npm start
```
You should see output similar to:
```text
✅ Connected to Redis Database

=========================================
🚀 Server running on http://localhost:3000
=========================================
```

---

## 🧪 Testing the APIs

Open your browser. Make sure to **keep your terminal open side-by-side** so you can see the cache hit/miss logs!

### Test 1: The Slow API (No Cache)
Visit 👉 [http://localhost:3000/users/no-cache](http://localhost:3000/users/no-cache)

Every time you refresh this page, you will notice a **2-second delay**.
Look at your terminal. You'll see:
```text
🔵 GET /users/no-cache called
    [DB] ⏳ Connecting to Database...
    [DB] ⏳ Running heavy SQL query to fetch users...
    [DB] ✅ Database query completed!
no-cache-request: 2005.123ms
```

### Test 2: The Fast API (With Redis Cache) ⚡
Visit 👉 [http://localhost:3000/users/cache](http://localhost:3000/users/cache)

#### The First Request (Cache Miss)
The first time you load this page, it will be slow (~2 seconds). Because Redis is currently empty, the application has to fetch data from the slow DB, and then it saves that data to Redis.
```text
🟢 GET /users/cache called
    [Cache] 🔍 Checking Redis for key: "users"...
    [Cache] 🐢 CACHE MISS! Data not found in Redis.
    [DB] ⏳ Connecting to Database...
    [DB] ⏳ Running heavy SQL query to fetch users...
    [DB] ✅ Database query completed!
    [Cache] 💾 Saving data to Redis with key: "users" for 60 seconds...
cache-request: 2010.456ms
```

#### The Second Request (Cache Hit)
Refresh the page again! It should be almost instant (less than 5ms). This is the power of caching!
```text
🟢 GET /users/cache called
    [Cache] 🔍 Checking Redis for key: "users"...
    [Cache] ⚡ CACHE HIT! Returning data from Redis immediately.
cache-request: 2.134ms
```
*(Note: We set the cache to expire after 60 seconds (TTL). If you wait 1 minute and refresh, it will be slow again!)*

---

## 🔎 Visualizing with RedisInsight

RedisInsight is a fantastic, free GUI tool by Redis that lets you look inside your database visually. Here is how to use it with this demo:

### 1. Install RedisInsight
Download and install it from the official website: [Download RedisInsight](https://redis.io/docs/ui/insight/)

### 2. Connect to our Local Redis
1. Open up RedisInsight.
2. Click **"Add Redis Database"** or the **"+"** sign.
3. Choose **"Add Database Manually"**.
4. Enter the connection details:
   - **Host:** `localhost`
   - **Port:** `6379`
   - **Alias (Name):** `Demo Redis` (or whatever you like)
5. Click **Add Redis Database** below.

### 3. Explore the Cache in Real-Time
1. Click on your newly added database to open it.
2. Hit the API endpoint again to make sure data is loaded: `http://localhost:3000/users/cache`.
3. In the **"Browser"** tab in RedisInsight, you should now see a key named **`users`**.
4. Click on the `users` key to view its value (you will see the raw JSON string).
5. **Check TTL:** In the top right section of the key details pane, you will see the `TTL` (Time To Live). When it hits 0, the key will automatically disappear!
6. **Live Testing:** While demonstrating, click the "Delete" (trash can) icon in RedisInsight to manually clear the cache key, then reload the web page to force another "Cache Miss" and show how the app gracefully recovers.
