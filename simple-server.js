// Minimal simple server for Quality Re-Org Platform
// Only requires express
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    res.status(500).send('Error loading the application. Please try again.');
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export for Vercel
module.exports = app; 