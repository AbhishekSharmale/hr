@echo off
echo Starting HR SaaS Platform...
echo.

cd backend
echo Starting Backend Server on http://localhost:5000
start "Backend" cmd /k "node server.js"

cd ..\frontend
echo Starting Frontend Server on http://localhost:3000
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   HR SaaS Platform is running!
echo ========================================
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ========================================
echo.
echo Press any key to close this window...
pause > nul