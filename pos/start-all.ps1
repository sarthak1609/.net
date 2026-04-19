# POS Cafe - Complete Startup Script (PowerShell)
# Run: .\start-all.ps1

$WORKSPACE = "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos"

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "    POS Cafe - Complete Startup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend in new tab/window
Write-Host "[1] Starting Backend (.NET on port 5000)..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$WORKSPACE\pos\backend-dotnet'; dotnet run" -WindowStyle Normal

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend in new tab/window
Write-Host "[2] Starting Frontend (React on port 5173)..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$WORKSPACE\pos'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "     Startup Complete!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Tip: Press Ctrl+C in any terminal to stop the server" -ForegroundColor Gray
Write-Host ""
