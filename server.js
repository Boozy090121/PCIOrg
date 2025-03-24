const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Set correct MIME types
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

// Custom middleware to verify files exist before serving
const validateStaticFilesExist = (req, res, next) => {
  const filePath = path.join(__dirname, 'public', req.path);
  
  // Skip API routes and other non-file requests
  if (req.path.startsWith('/api') || req.path === '/') {
    return next();
  }
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.warn(`File not found: ${filePath}`);
      // Continue to next middleware (will fall through to the catch-all route)
      return next();
    }
    // File exists, continue
    next();
  });
};

// Serve static files from 'public' directory
app.use(validateStaticFilesExist);
app.use(express.static(path.join(__dirname, 'public')));

// Import Firebase routes
try {
  const firebaseRoutes = require('./firebase-init');
  app.use(firebaseRoutes);
} catch (error) {
  console.error('Error loading Firebase routes:', error);
  // Provide an empty router if Firebase fails to load
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/firebase')) {
      return res.status(500).json({ error: 'Firebase not available', message: error.message });
    }
    next();
  });
}

// Define routes for legacy API endpoints (will be migrated to Firebase)
app.get('/api/teams', (req, res) => {
  // Return mock data for teams
  res.json({
    teams: [
      { id: 1, name: 'BBV Quality Team', stream: 'bbv' },
      { id: 2, name: 'ADD Quality Team', stream: 'add' },
      { id: 3, name: 'ARB Quality Team', stream: 'arb' }
    ]
  });
});

app.get('/api/personnel', (req, res) => {
  // Return mock data for personnel
  res.json({
    personnel: [
      { id: 1, name: 'John Smith', role: 'Quality Account Manager', stream: 'bbv' },
      { id: 2, name: 'Jane Doe', role: 'Quality Engineer', stream: 'bbv' },
      { id: 3, name: 'Michael Brown', role: 'Quality Coordinator', stream: 'bbv' },
      { id: 4, name: 'Sarah Johnson', role: 'Quality Account Manager', stream: 'add' },
      { id: 5, name: 'Robert Williams', role: 'Document Control Specialist', stream: 'add' },
      { id: 6, name: 'Emily Davis', role: 'Quality Lead', stream: 'arb' },
      { id: 7, name: 'James Wilson', role: 'Quality Specialist', stream: 'arb' },
      { id: 8, name: 'Lisa Thompson', role: 'Quality Engineer', stream: 'shared' }
    ]
  });
});

// Server health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: require('./package.json').version,
    time: new Date().toISOString()
  });
});

// Config endpoint to provide client-side configuration
app.get('/api/config', (req, res) => {
  res.json({
    firebase: {
      enabled: true,
      projectId: process.env.FIREBASE_PROJECT_ID || 'quality-org-hub'
    },
    features: {
      useFirebase: true,
      offlineMode: false,
      mockData: process.env.USE_MOCK_DATA === 'true'
    }
  });
});

// Serve index.html for all other routes (client-side routing)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  // Safely check if the file exists before sending
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      // If index.html doesn't exist, try to serve the recovery page
      const recoveryPath = path.join(__dirname, 'public', 'recovery', 'basic.html');
      
      fs.access(recoveryPath, fs.constants.F_OK, (recoveryErr) => {
        if (recoveryErr) {
          // Neither index.html nor recovery page exists
          return res.status(500).send(`
            <html>
              <head><title>Server Error</title></head>
              <body>
                <h1>Server Error</h1>
                <p>Could not find the main application files. Please check your deployment.</p>
                <p>Error: ${err.message}</p>
              </body>
            </html>
          `);
        }
        
        // Serve recovery page
        res.sendFile(recoveryPath);
      });
      return;
    }
    
    // Serve the main index.html file
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

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Open http://localhost:${port} in your browser`);
  });
} 