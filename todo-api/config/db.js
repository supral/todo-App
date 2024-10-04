const { Sequelize } = require('sequelize');

// Set up Sequelize to connect to PostgreSQL
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false, // Turn off logging for production
});

module.exports = sequelize;
