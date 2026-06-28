const { Sequelize } = require('sequelize');

// Create Sequelize instance
// It expects DB_NAME, DB_USER, DB_PASSWORD, DB_HOST from environment variables.
// If they are not present, it will fallback to defaults, but we should rely on .env
const sequelize = new Sequelize(
    process.env.DB_NAME || 'delta_school',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false, // Set to console.log to see SQL queries
    }
);

// Test the connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connection established successfully through Sequelize.');
    } catch (error) {
        console.error('Unable to connect to the MySQL database:', error);
    }
};

module.exports = { sequelize, connectDB };
