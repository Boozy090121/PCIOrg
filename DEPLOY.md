# Deployment Guide for Quality Re-Org Platform

This guide provides instructions for deploying the Quality Re-Org Platform when npm is not available on your system.

## Option 1: Deploy to Vercel via Web Interface (Recommended)

1. **Prepare your files**:
   - Run the `deploy.bat` script which will set up the necessary directory structure
   - Make sure your project has the following files:
     - `public/index.html` 
     - `simple-server.js`
     - `vercel.json`

2. **Create a Vercel account**:
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with your GitHub, GitLab, or email

3. **Deploy your project**:
   - Click "New Project" in the Vercel dashboard
   - Import from your Git repository or upload your files manually
   - If uploading manually:
     - Click "Upload" and select your entire project folder
     - Make sure all required files are included
   - Follow the on-screen instructions to complete the deployment
   - Vercel will handle the build process in the cloud (no need for npm locally)

4. **Configure your deployment**:
   - Use the following settings:
     - Framework Preset: Other
     - Build Command: (leave blank)
     - Output Directory: public

5. **Access your deployed application**:
   - Vercel will provide a URL where your application is available
   - You can add a custom domain in the project settings if needed

## Option 2: Install Node.js and npm

If you want to use the full functionality of the application:

1. **Download Node.js**:
   - Go to [nodejs.org](https://nodejs.org/)
   - Download the LTS version for Windows
   - Run the installer and follow the instructions

2. **Verify installation**:
   - Open a new Command Prompt window (important)
   - Type `node -v` to verify Node.js is installed
   - Type `npm -v` to verify npm is installed

3. **Install dependencies**:
   - Navigate to your project folder
   - Run `npm install`

4. **Deploy using npm**:
   - Run `npm run deploy` to deploy to Vercel

## Option 3: Use the Local Version

If you just want to use the application locally without deploying:

1. **Run the deploy.bat script**:
   - This creates the necessary file structure
   - It generates the basic HTML files needed

2. **Open the basic version directly**:
   - Navigate to the `public` folder
   - Open `index.html` in your web browser
   - Or open `public/recovery/basic.html` for the simplified version

## Troubleshooting

- **Error: Cannot find module 'express'**
  - This happens when Node.js is installed but dependencies aren't
  - Run `npm install express` if you have npm

- **Vercel Deployment Failing**
  - Make sure `vercel.json` and `simple-server.js` are in the root directory
  - Check that `public/index.html` exists
  - Try simplifying the application to just the basics for initial deployment

- **Files Not Found**
  - Run `deploy.bat` to create the necessary file structure
  - Make sure you're uploading the entire project folder, not just individual files

For additional help, see [Vercel documentation](https://vercel.com/docs) or contact support. 