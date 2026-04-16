// This file simulates a slow database query.
// In a real application, this would connect to MongoDB, PostgreSQL, MySQL, etc.

const mockUsers = [
  { id: 1, name: "Alice", role: "Admin" },
  { id: 2, name: "Bob", role: "Editor" },
  { id: 3, name: "Charlie", role: "Viewer" },
  { id: 4, name: "Diana", role: "Viewer" },
  { id: 5, name: "Eve", role: "Admin" }
];

/**
 * Simulates fetching users from a database with a 2-second delay
 * @returns {Promise<Array>} List of users
 */
const fetchUsersFromDB = () => {
    return new Promise((resolve) => {
        console.log("    [DB] ⏳ Connecting to Database...");
        console.log("    [DB] ⏳ Running heavy SQL query to fetch users...");
        
        // Simulate a 2-second delay (2000 milliseconds)
        setTimeout(() => {
            console.log("    [DB] ✅ Database query completed!");
            resolve(mockUsers);
        }, 2000);
    });
};

module.exports = {
    fetchUsersFromDB
};
