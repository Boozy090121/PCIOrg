@echo off
echo Starting Quality Re-Org & Capability Management Platform...
echo.

REM Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js is required but not found in PATH.
  echo Please install Node.js from https://nodejs.org/
  echo.
  echo But we'll try to run the fixed version without Node.js...
  echo.
  goto start_fixed_version
)

REM Check npm packages (optional)
if not exist "node_modules" (
  echo NOTE: npm packages are not installed.
  echo We'll try to start the fixed version without them.
  echo.
  goto start_fixed_version
)

:start_fixed_version
echo Starting the fixed version of the application...
echo.
echo This will open the fixed index-fixed.html file directly in your browser.
echo If it doesn't open automatically, please manually open index-fixed.html
echo in your browser.
echo.

start index-fixed.html
echo.
echo Press any key to exit...
pause >nul 