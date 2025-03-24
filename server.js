const express = require('express');
const path = require('path');
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

// Serve static files
app.use(express.static(__dirname));

// Import Firebase routes
const firebaseRoutes = require('./firebase-init');
app.use(firebaseRoutes);

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
  res.sendFile(path.join(__dirname, 'index.html'));
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