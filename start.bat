@echo off
echo Quality Re-Org Platform Launcher
echo ===============================
echo.

echo Select an option:
echo 1. Start application (with all features)
echo 2. Start in recovery mode
echo 3. Exit
echo.

set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
  call tools\startup.bat
) else if "%choice%"=="2" (
  call tools\basic-mode.bat
) else (
  echo Exiting...
)

exit /b 0 