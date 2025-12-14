const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set JWT secret for tests
process.env.JWT_SECRET = 'test-secret-key-for-jwt-2024';

const app = express();

app.use(cors());
app.use(express.json());

// Import models first to ensure they're loaded
require('../models/User');
require('../models/Sweet');

// Import routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/sweets', require('../routes/sweets'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Test server error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

module.exports = app;