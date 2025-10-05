@echo off
echo Starting HR SaaS Platform Development Servers...
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
echo.

echo Installing Frontend Dependencies...
cd ..\frontend  
call npm install
echo.

echo Dependencies installed successfully!
echo.

echo Starting Backend Server...
cd ..\backend
start "Backend Server" cmd /k "npm run dev"

echo Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   HR SaaS Platform is starting up!
echo ========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
pause