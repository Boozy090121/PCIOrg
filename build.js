// Build script for Quality Re-Org Platform
const fs = require('fs-extra');
const path = require('path');

console.log('Starting build process...');

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
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.ensureDirSync(dir);
  }
});

// Check if index.html exists, if not copy from recovery basic.html
const indexPath = path.join('public', 'index.html');

if (!fs.existsSync(indexPath)) {
  console.log('index.html not found. Checking for alternatives...');
  
  // Try to copy from recovery/basic.html if it exists
  const basicHtmlPath = path.join('public', 'recovery', 'basic.html');
  
  if (fs.existsSync(basicHtmlPath)) {
    console.log('Copying basic.html to index.html as a fallback');
    fs.copySync(basicHtmlPath, indexPath);
  } else {
    // Create a simple placeholder index.html
    console.log('Creating placeholder index.html');
    const placeholderHtml = `
<!DOCTYPE html>
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
    <p>Welcome to the Quality Re-Org Platform. The main application is currently unavailable.</p>
    <p>Please use one of the recovery tools below:</p>
    <a href="/recovery/diagnose.html" class="btn">Diagnostic Tool</a>
    <a href="/recovery/auto-fix.html" class="btn">Auto Fix Tool</a>
    <a href="/recovery/basic.html" class="btn">Basic Mode</a>
  </div>
</body>
</html>
    `;
    fs.writeFileSync(indexPath, placeholderHtml);
  }
}

// Check if we need to install or update dependencies
try {
  console.log('Installing dependencies...');
  require('child_process').execSync('npm install', { stdio: 'inherit' });
} catch (err) {
  console.error('Warning: Error installing dependencies:', err.message);
  console.log('Continuing build process...');
}

console.log('Build completed successfully!'); 