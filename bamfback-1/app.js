const express = require('express');
const routes = require('./routes');
const db = require('./db');
const logger = require('./utils/logger');
require('./jobs/cleanupBookings');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const cors = require("cors");

// Enable CORS
app.use(cors({
  origin: "http://localhost:4200", // Allow Angular frontend
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Register routes
app.use('/api', routes);  // All routes starting with /api will be handled here


// Set up Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KK-Booking System',
      version: '1.0.0',
      description: 'This API is used to manage and confirm online appointment bookings via a central system.',
    },
  },
  apis: ['./routes/*.js'], // Path to the API route files
};

// Generate the Swagger specification
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Use Swagger UI to serve the docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});