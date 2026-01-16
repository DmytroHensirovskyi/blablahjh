require('dotenv').config();
const knex = require('knex');
const config = require('./knexfile');

// Use the environment variable to determine the configuration (e.g., 'development' or 'production')
const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);


module.exports = db;