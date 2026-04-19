@echo off
echo Starting POS Cafe Backend...
cd /d "%~dp0"
dotnet run --configuration Release
pause
