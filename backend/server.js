// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getGroqResponse } = require('./groqService');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests from React app
app.use(express.json()); // Parse JSON request bodies

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Chatbot Backend Server is running!' });
});

// POST route to handle chat messages
app.post('/api/message', async (req, res) => {
  try {
    // Get the user message from request body
    const { message } = req.body;
    
    // Basic validation
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }
    
    console.log('Received message:', message); // For debugging
    
    // Check if GROQ API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found in environment variables');
      return res.status(500).json({
        error: 'Server configuration error: API key not found'
      });
    }
    
    // Get AI response from GROQ
    const botResponse = await getGroqResponse(message);
    
    // Send response back to frontend
    res.json({
      success: true,
      response: botResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Test the API at: http://localhost:${PORT}/api/message`);
});

module.exports = app;