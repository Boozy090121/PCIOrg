@echo off
echo Starting Quality Re-Org & Capability Management Platform...
echo.

REM Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Error: Node.js is required but not found in PATH.
  echo Please install Node.js from https://nodejs.org/
  echo.
  pause
  exit /b 1
)

REM Check for npm packages
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
  )
)

REM Set Firebase configuration environment variables
set FIREBASE_PROJECT_ID=quality-org-hub

echo Starting server on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm start 