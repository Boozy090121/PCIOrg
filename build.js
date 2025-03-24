// Build script for Quality Re-Org Platform
console.log('Starting build process...');

// Use native fs if fs-extra isn't available
let fs;
try {
  fs = require('fs-extra');
  console.log('Using fs-extra for file operations');
} catch (err) {
  console.log('fs-extra not found, using native fs module');
  fs = require('fs');
  
  // Add ensureDirSync functionality if using native fs
  fs.ensureDirSync = function(dir) {
    if (!fs.existsSync(dir)) {
      const parentDir = require('path').dirname(dir);
      if (!fs.existsSync(parentDir)) {
        fs.ensureDirSync(parentDir);
      }
      fs.mkdirSync(dir);
    }
  };
  
  // Add copySync functionality if using native fs
  fs.copySync = function(src, dest) {
    const content = fs.readFileSync(src);
    fs.writeFileSync(dest, content);
  };
}

const path = require('path');

// Define required directories
const requiredDirs = [
  'public',
  'public/js',
  'public/js/core',
  'public/js/modules',
  'public/js/utils',
  'public/css',
  'public/recovery',
  'public/recovery/scripts'
];

// Ensure all directories exist
requiredDirs.forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.ensureDirSync(dir);
    }
  } catch (err) {
    console.error(`Error creating directory ${dir}:`, err.message);
  }
});

// Create a simple placeholder index.html
const indexPath = path.join('public', 'index.html');

try {
  // Check if index.html exists, if not create it
  if (!fs.existsSync(indexPath)) {
    console.log('index.html not found. Creating placeholder...');
    
    // Create a simple placeholder index.html
    const placeholderHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quality Re-Org Platform</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f8f9fa;
      color: #212529;
      text-align: center;
    }
    .container {
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #00518A;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      margin: 10px;
      background-color: #00518A;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Quality Re-Org Platform</h1>
    <p>Welcome to the Quality Re-Org Platform.</p>
    <p>The application is loading...</p>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Check if recovery tools are available
      fetch('/recovery/basic.html')
        .then(response => {
          if (response.ok) {
            const recoveryLink = document.createElement('p');
            recoveryLink.innerHTML = '<a href="/recovery/basic.html" class="btn">Launch Basic Mode</a>';
            document.querySelector('.container').appendChild(recoveryLink);
          }
        })
        .catch(err => console.log('Recovery tools not available'));
    });
  </script>
</body>
</html>`;
    
    fs.writeFileSync(indexPath, placeholderHtml);
    console.log('Created placeholder index.html');
  } else {
    console.log('index.html already exists');
  }
} catch (err) {
  console.error('Error creating index.html:', err.message);
}

// Try to create a basic recovery HTML if it doesn't exist
try {
  const recoveryDir = path.join('public', 'recovery');
  const basicHtmlPath = path.join(recoveryDir, 'basic.html');
  
  if (!fs.existsSync(basicHtmlPath)) {
    console.log('basic.html not found in recovery directory. Creating...');
    
    // Create recovery directory if it doesn't exist
    if (!fs.existsSync(recoveryDir)) {
      fs.ensureDirSync(recoveryDir);
    }
    
    const basicHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quality Re-Org Platform - Basic Mode</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
      color: #212529;
    }
    
    .app-container {
      display: flex;
      height: 100vh;
    }
    
    .sidebar {
      width: 250px;
      background-color: #ffffff;
      border-right: 1px solid #dee2e6;
      height: 100%;
      overflow-y: auto;
    }
    
    .main-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
    
    .sidebar-header {
      padding: 15px;
      border-bottom: 1px solid #dee2e6;
      background-color: #00518A;
      color: white;
    }
    
    .sidebar-header h1 {
      margin: 0;
      font-size: 1.25rem;
    }
  </style>
</head>
<body>
  <div class="app-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <h1>Quality Re-Org Hub</h1>
      </div>
    </div>
    <div class="main-content">
      <h2>Basic Mode</h2>
      <p>This is a simplified version of the application that works without advanced features.</p>
    </div>
  </div>
</body>
</html>`;
    
    fs.writeFileSync(basicHtmlPath, basicHtml);
    console.log('Created basic recovery HTML');
  } else {
    console.log('basic.html already exists in recovery directory');
  }
} catch (err) {
  console.error('Error creating basic.html:', err.message);
}

console.log('Build completed successfully!'); 