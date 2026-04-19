@echo off
REM Start POS Cafe - Full Stack
REM Opens 2 terminals: one for backend, one for frontend

echo.
echo ====================================
echo    POS Cafe - Complete Startup
echo ====================================
echo.

REM Get the workspace root
set WORKSPACE=C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos

echo [1] Starting Backend (.NET on port 5000)...
start "Backend - POS Cafe" cmd /k "cd /d %WORKSPACE%\pos\backend-dotnet && dotnet run"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak

echo [2] Starting Frontend (React on port 5173)...
start "Frontend - POS Cafe" cmd /k "cd /d %WORKSPACE%\pos && npm run dev"

echo.
echo ====================================
echo     Startup Complete!
echo ====================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Tip: Press Ctrl+C in any terminal to stop the server
echo.
