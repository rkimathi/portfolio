/**
 * Database configuration for Roy Kimathi's Portfolio
 */

module.exports = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'portfolio_user',
    password: process.env.DB_PASSWORD || 'secure_password_123', // Change this in production
    database: process.env.DB_NAME || 'roy_kimathi_portfolio',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
};