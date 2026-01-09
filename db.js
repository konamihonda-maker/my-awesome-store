// db.js - Database Connection Logic
const mysql = require('mysql2/promise');

// 💡 Laragon Default Settings: user: root, password: '' (empty)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shop_db',
    waitForConnections: true,
    connectionLimit: 10, // Max simultaneous connections
    queueLimit: 0
});

console.log("Database connection pool created.");

module.exports = pool;