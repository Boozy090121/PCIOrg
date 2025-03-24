@echo off
echo Quality Re-Org Platform - Deployment Helper
echo =========================================
echo.
echo This script will help you deploy the application without requiring npm locally.
echo.

echo Step 1: Ensuring the basic directory structure exists...
if not exist "public" mkdir public
if not exist "public\js" mkdir public\js
if not exist "public\js\core" mkdir public\js\core
if not exist "public\js\modules" mkdir public\js\modules
if not exist "public\js\utils" mkdir public\js\utils
if not exist "public\css" mkdir public\css
if not exist "public\recovery" mkdir public\recovery
if not exist "public\recovery\scripts" mkdir public\recovery\scripts

echo Directory structure created.
echo.

echo Step 2: Creating a placeholder index.html if it doesn't exist...
if not exist "public\index.html" (
  echo ^<!DOCTYPE html^> > public\index.html
  echo ^<html lang="en"^> >> public\index.html
  echo ^<head^> >> public\index.html
  echo   ^<meta charset="UTF-8"^> >> public\index.html
  echo   ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> public\index.html
  echo   ^<title^>Quality Re-Org Platform^</title^> >> public\index.html
  echo   ^<style^> >> public\index.html
  echo     body { >> public\index.html
  echo       font-family: Arial, sans-serif; >> public\index.html
  echo       margin: 0; >> public\index.html
  echo       padding: 20px; >> public\index.html
  echo       background-color: #f8f9fa; >> public\index.html
  echo       color: #212529; >> public\index.html
  echo       text-align: center; >> public\index.html
  echo     } >> public\index.html
  echo     .container { >> public\index.html
  echo       max-width: 800px; >> public\index.html
  echo       margin: 50px auto; >> public\index.html
  echo       padding: 20px; >> public\index.html
  echo       background-color: white; >> public\index.html
  echo       border-radius: 5px; >> public\index.html
  echo       box-shadow: 0 2px 10px rgba(0,0,0,0.1); >> public\index.html
  echo     } >> public\index.html
  echo     h1 { >> public\index.html
  echo       color: #00518A; >> public\index.html
  echo     } >> public\index.html
  echo     .btn { >> public\index.html
  echo       display: inline-block; >> public\index.html
  echo       padding: 10px 20px; >> public\index.html
  echo       margin: 10px; >> public\index.html
  echo       background-color: #00518A; >> public\index.html
  echo       color: white; >> public\index.html
  echo       text-decoration: none; >> public\index.html
  echo       border-radius: 5px; >> public\index.html
  echo     } >> public\index.html
  echo   ^</style^> >> public\index.html
  echo ^</head^> >> public\index.html
  echo ^<body^> >> public\index.html
  echo   ^<div class="container"^> >> public\index.html
  echo     ^<h1^>Quality Re-Org Platform^</h1^> >> public\index.html
  echo     ^<p^>Welcome to the Quality Re-Org Platform.^</p^> >> public\index.html
  echo     ^<p^>The application is loading...^</p^> >> public\index.html
  echo     ^<div id="recovery-links" style="margin-top: 30px;"^> >> public\index.html
  echo       ^<p^>If the application doesn't load, try one of these options:^</p^> >> public\index.html
  echo       ^<a href="/recovery/basic.html" class="btn"^>Basic Mode^</a^> >> public\index.html
  echo     ^</div^> >> public\index.html
  echo   ^</div^> >> public\index.html
  echo ^</body^> >> public\index.html
  echo ^</html^> >> public\index.html
  echo Created index.html file.
) else (
  echo index.html already exists.
)
echo.

echo Step 3: Creating basic.html in the recovery directory...
if not exist "public\recovery\basic.html" (
  echo ^<!DOCTYPE html^> > public\recovery\basic.html
  echo ^<html lang="en"^> >> public\recovery\basic.html
  echo ^<head^> >> public\recovery\basic.html
  echo   ^<meta charset="UTF-8"^> >> public\recovery\basic.html
  echo   ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> public\recovery\basic.html
  echo   ^<title^>Quality Re-Org Platform - Basic Mode^</title^> >> public\recovery\basic.html
  echo   ^<style^> >> public\recovery\basic.html
  echo     body { >> public\recovery\basic.html
  echo       font-family: Arial, sans-serif; >> public\recovery\basic.html
  echo       margin: 0; >> public\recovery\basic.html
  echo       padding: 0; >> public\recovery\basic.html
  echo       background-color: #f8f9fa; >> public\recovery\basic.html
  echo       color: #212529; >> public\recovery\basic.html
  echo     } >> public\recovery\basic.html
  echo     .app-container { >> public\recovery\basic.html
  echo       display: flex; >> public\recovery\basic.html
  echo       height: 100vh; >> public\recovery\basic.html
  echo     } >> public\recovery\basic.html
  echo     .sidebar { >> public\recovery\basic.html
  echo       width: 250px; >> public\recovery\basic.html
  echo       background-color: #ffffff; >> public\recovery\basic.html
  echo       border-right: 1px solid #dee2e6; >> public\recovery\basic.html
  echo       height: 100%%; >> public\recovery\basic.html
  echo       overflow-y: auto; >> public\recovery\basic.html
  echo     } >> public\recovery\basic.html
  echo     .main-content { >> public\recovery\basic.html
  echo       flex: 1; >> public\recovery\basic.html
  echo       padding: 20px; >> public\recovery\basic.html
  echo       overflow-y: auto; >> public\recovery\basic.html
  echo     } >> public\recovery\basic.html
  echo     .sidebar-header { >> public\recovery\basic.html
  echo       padding: 15px; >> public\recovery\basic.html
  echo       border-bottom: 1px solid #dee2e6; >> public\recovery\basic.html
  echo       background-color: #00518A; >> public\recovery\basic.html
  echo       color: white; >> public\recovery\basic.html
  echo     } >> public\recovery\basic.html
  echo     .sidebar-header h1 { >> public\recovery\basic.html
  echo       margin: 0; >> public\recovery\basic.html
  echo       font-size: 1.25rem; >> public\recovery\basic.html
  echo     } >> public\recovery\basic.html
  echo   ^</style^> >> public\recovery\basic.html
  echo ^</head^> >> public\recovery\basic.html
  echo ^<body^> >> public\recovery\basic.html
  echo   ^<div class="app-container"^> >> public\recovery\basic.html
  echo     ^<div class="sidebar"^> >> public\recovery\basic.html
  echo       ^<div class="sidebar-header"^> >> public\recovery\basic.html
  echo         ^<h1^>Quality Re-Org Hub^</h1^> >> public\recovery\basic.html
  echo       ^</div^> >> public\recovery\basic.html
  echo     ^</div^> >> public\recovery\basic.html
  echo     ^<div class="main-content"^> >> public\recovery\basic.html
  echo       ^<h2^>Basic Mode^</h2^> >> public\recovery\basic.html
  echo       ^<p^>This is a simplified version of the application that works without advanced features.^</p^> >> public\recovery\basic.html
  echo       ^<p^>Since npm is not available on your system, you are seeing this basic version of the app.^</p^> >> public\recovery\basic.html
  echo     ^</div^> >> public\recovery\basic.html
  echo   ^</div^> >> public\recovery\basic.html
  echo ^</body^> >> public\recovery\basic.html
  echo ^</html^> >> public\recovery\basic.html
  echo Created basic.html file.
) else (
  echo basic.html already exists.
)
echo.

echo Step 4: Deployment options...
echo.
echo Since npm is not available on your system, you have the following options:
echo.
echo 1. Deploy to Vercel through the web interface:
echo    - Go to https://vercel.com
echo    - Sign in or create an account
echo    - Create a new project and import your repository
echo    - Vercel will handle the build process in the cloud
echo.
echo 2. Install Node.js and npm:
echo    - Download from https://nodejs.org/
echo    - Install the LTS version for Windows
echo    - After installation, restart your computer
echo    - Then you can use "npm run deploy" command
echo.
echo 3. Use the GitHub integration:
echo    - Connect your GitHub repository to Vercel
echo    - Every push to the repository will trigger a deployment
echo.

echo Press any key to open the Vercel website...
pause > nul
start https://vercel.com/

echo Done!
echo.
pause 