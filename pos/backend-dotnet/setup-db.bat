@echo off
REM Setup MySQL Database for POS Cafe
REM Run this ONCE before starting the application

echo Creating database and tables...
mysql -u root -pSarthak@16 < database-schema.sql

if %ERRORLEVEL% EQU 0 (
	echo.
	echo SUCCESS: Database setup complete!
	echo You can now run start-all.bat
) else (
	echo.
	echo ERROR: Database setup failed. Check MySQL is running and password is correct.
	pause
)
