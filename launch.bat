@echo off
echo Quality Re-Org Platform
echo =====================
echo.
echo Starting application, please wait...
echo.

REM Check if user wants to start in recovery mode
set /p recovery="Start in recovery mode? (y/n): "

if /i "%recovery%"=="y" (
  echo.
  echo Starting in recovery mode...
  call tools\basic-mode.bat
) else (
  echo.
  echo Starting normal application...
  call npm start
)

echo.
echo Application closed.
pause 