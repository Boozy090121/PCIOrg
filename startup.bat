@echo off
setlocal

echo.
echo =================================================
echo  Quality Re-Org & Capability Management Platform
echo =================================================
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

REM Check if we need to install/update dependencies
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
  )
)

REM Check for Firebase CLI and login status
where firebase >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo Checking Firebase login status...
  call firebase login:list >nul 2>&1
  if %ERRORLEVEL% NEQ 0 (
    echo You are not logged in to Firebase.
    echo Would you like to log in now? (Y/N)
    set /p firebaseLogin=
    if /i "%firebaseLogin%"=="Y" (
      call firebase login
    )
  ) else (
    echo Firebase login detected.
  )
) else (
  echo Firebase CLI not found. Skipping Firebase login check.
  echo If you want to use Firebase CLI features, install it with:
  echo npm install -g firebase-tools
)

REM Set Firebase configuration environment variables
set FIREBASE_PROJECT_ID=quality-org-hub

REM Check if user wants to run in development mode
echo.
echo Select startup mode:
echo 1. Development (with hot reload)
echo 2. Production
echo.
set /p mode=Enter selection (1/2): 

if "%mode%"=="1" (
  echo.
  echo Starting in DEVELOPMENT mode...
  echo.
  call npm run dev
) else if "%mode%"=="2" (
  echo.
  echo Starting in PRODUCTION mode...
  echo.
  call npm start
) else (
  echo.
  echo Invalid selection. Starting in PRODUCTION mode...
  echo.
  call npm start
)

echo.
if %ERRORLEVEL% NEQ 0 (
  echo Application exited with an error. Please check the logs above.
) else (
  echo Application has been shut down.
)

pause
endlocal 