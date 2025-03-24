@echo off
echo Quality Re-Org Platform - Recovery Mode
echo ======================================
echo.
echo This launcher will open the application in basic recovery mode.
echo.

echo Choose an option:
echo 1. Launch diagnostic tool
echo 2. Launch automatic repair tool
echo 3. Launch fixed application
echo 4. Exit
echo.

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
  start diagnose.html
) else if "%choice%"=="2" (
  start auto-fix.html
) else if "%choice%"=="3" (
  start index-fixed.html
) else (
  echo Exiting...
)

pause 