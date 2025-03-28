@echo off
setlocal

echo.
echo =================================================
echo  Quality Re-Org & Capability Management Platform
echo =================================================
echo.

REM Check for recovery mode flag
set RECOVERY_MODE=0
if "%1"=="--recovery" (
  set RECOVERY_MODE=1
  goto recovery_menu
)

REM Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Error: Node.js is required but not found in PATH.
  echo Please install Node.js from https://nodejs.org/
  echo.
  echo Would you like to launch in recovery mode instead? (Y/N)
  set /p recover=
  if /i "%recover%"=="Y" (
    goto recovery_menu
  ) else (
    pause
    exit /b 1
  )
)

REM Check if we need to install/update dependencies
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install dependencies.
    echo.
    echo Would you like to launch in recovery mode instead? (Y/N)
    set /p recover=
    if /i "%recover%"=="Y" (
      goto recovery_menu
    ) else (
      pause
      exit /b 1
    )
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
echo 3. Recovery Mode
echo.
set /p mode=Enter selection (1/2/3): 

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
) else if "%mode%"=="3" (
  echo.
  echo Starting in RECOVERY mode...
  goto recovery_menu
) else (
  echo.
  echo Invalid selection. Starting in PRODUCTION mode...
  echo.
  call npm start
)

echo.
if %ERRORLEVEL% NEQ 0 (
  echo Application exited with an error. Please check the logs above.
  echo.
  echo Would you like to try launching in recovery mode? (Y/N)
  set /p recover=
  if /i "%recover%"=="Y" (
    goto recovery_menu
  )
) else (
  echo Application has been shut down.
)

pause
exit /b 0

:recovery_menu
echo.
echo =================================================
echo  RECOVERY MODE
echo =================================================
echo.
echo Choose a recovery option:
echo 1. Launch module diagnostic tool
echo 2. Launch automatic repair tool
echo 3. Launch fixed application
echo 4. Launch basic mode
echo 5. Return to normal startup
echo.
set /p recovery_choice=Enter choice (1-5): 

if "%recovery_choice%"=="1" (
  start diagnose.html
) else if "%recovery_choice%"=="2" (
  start auto-fix.html
) else if "%recovery_choice%"=="3" (
  start index-fixed.html
) else if "%recovery_choice%"=="4" (
  start basic.html
) else if "%recovery_choice%"=="5" (
  if %RECOVERY_MODE%==0 (
    goto :eof
  ) else (
    set RECOVERY_MODE=0
    cls
    goto :start
  )
) else (
  echo Invalid choice. Starting basic mode...
  start basic.html
)

echo Recovery tool launched.
pause
endlocal 