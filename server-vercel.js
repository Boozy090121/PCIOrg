// Simplified server for Vercel deployment
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: require('./package.json').version,
    time: new Date().toISOString()
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  // Check if index.html exists
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      // If index.html doesn't exist, use simple error page
      return res.status(404).send(`
        <html>
          <head><title>Page Not Found</title></head>
          <body>
            <h1>Page Not Found</h1>
            <p>The requested page could not be found.</p>
            <p><a href="/">Go to Home</a></p>
          </body>
        </html>
      `);
    }
    
    res.sendFile(indexPath);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message
  });
});

// Export the Express app for Vercel
module.exports = app; 