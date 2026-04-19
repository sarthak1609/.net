# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## 1️⃣ Backend Issues

### ❌ Error: "Port 5000 is already in use"

**Solution:**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Example output:
# TCP    127.0.0.1:5000     0.0.0.0:0    LISTENING    1234

# Kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F

# Then try running backend again
cd pos\backend-dotnet
dotnet run
```

---

### ❌ Error: "MySQL connection failed"

**Solution 1: Check MySQL is running**
```powershell
# Try to connect to MySQL
mysql -u root -p
# Enter password: Sarthak@16

# If fails, MySQL service is not running
# Check Services or restart MySQL:
net start MySQL80  # or MySQL57, depending on version
```

**Solution 2: Verify credentials**
Edit `pos/backend-dotnet/appsettings.json`:
```json
{
  "Database": {
	"ConnectionString": "Server=localhost;User ID=root;Password=Sarthak@16;Database=cafe;"
  }
}
```

**Solution 3: Check database exists**
```powershell
mysql -u root -p
# Enter password

# In MySQL console:
SHOW DATABASES;
# You should see 'cafe' listed

# If not, create it:
CREATE DATABASE cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### ❌ Error: "No tables in database"

**Solution: Create tables**
```powershell
mysql -u root -p cafe
# Enter password

# Paste all CREATE TABLE statements from QUICKSTART.md
# Or run the full SQL script
```

---

### ❌ Error: "dotnet: command not found"

**Solution: Install .NET 7**
1. [Download .NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
2. Install it
3. Verify: `dotnet --version`

---

### ❌ Error: "Build fails with CS errors"

**Solution 1: Clean & Rebuild**
```powershell
cd pos\backend-dotnet
dotnet clean
dotnet restore
dotnet build
```

**Solution 2: Check .NET version**
```powershell
dotnet --version
# Should be 7.x.x
```

---

## 2️⃣ Frontend Issues

### ❌ Error: "Cannot find module"

**Solution:**
```powershell
cd pos
rm -r node_modules package-lock.json
npm install
npm run dev
```

---

### ❌ Error: "npm: command not found"

**Solution: Install Node.js**
1. [Download Node.js 16+](https://nodejs.org/)
2. Install it
3. Verify: `node --version` and `npm --version`

---

### ❌ Error: "API returns 401 Unauthorized"

**Problem:** JWT token is missing or expired

**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check: `localStorage.getItem('authToken')`
4. If empty or old, login again

**Solution 2: Clear localStorage**
```javascript
// In browser console:
localStorage.clear();
// Then refresh and login again
```

---

### ❌ Error: "Cannot reach http://localhost:5000"

**Solution 1: Backend not running**
```powershell
# Check if backend is running:
netstat -ano | findstr :5000

# If nothing shows, start backend:
cd pos\backend-dotnet
dotnet run
```

**Solution 2: CORS error**
Check browser console for CORS error. If you see:
```
Access to XMLHttpRequest blocked by CORS policy
```

This means backend isn't running or misconfigured. Verify `Program.cs` has:
```csharp
app.UseCors(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
```

**Solution 3: API URL in .env**
Verify `pos/.env`:
```
VITE_API_BASE_URL=http://localhost:5000
```

---

## 3️⃣ General Issues

### ❌ Error: "Port 5173 already in use"

**Solution:**
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

### ❌ App loads but nothing shows

**Solution 1: Hard refresh**
```
Ctrl + Shift + R  (Windows)
Cmd + Shift + R   (Mac)
```

**Solution 2: Clear cache**
- F12 → Application tab → Clear Site Data
- Or: Ctrl+Shift+Delete → Select "All time" → Clear

**Solution 3: Check console errors**
- Press F12 → Console tab
- Look for red error messages
- Share the error message for debugging

---

### ❌ Login works but app doesn't load

**Solution 1: Token stored correctly?**
```javascript
// Browser console:
console.log(localStorage.getItem('authToken'));
console.log(localStorage.getItem('user'));
```

**Solution 2: Re-login**
```javascript
// Browser console:
localStorage.clear();
location.reload();
```

---

## 4️⃣ Performance Issues

### ⚠️ App is slow

**Solution 1: Check backend response time**
```powershell
# In browser DevTools → Network tab
# Look at XHR requests and their response times
# Should be < 500ms for most endpoints
```

**Solution 2: MySQL slow queries**
```sql
-- Check if queries are slow
SHOW FULL PROCESSLIST;
-- Look for queries taking > 1 second
```

---

## 5️⃣ Database Issues

### ❌ Can't connect to MySQL at all

**Step 1: Check MySQL service status**
```powershell
# Check services
Get-Service | where {$_.Name -like "*MySQL*"}

# If stopped, start it:
net start MySQL80
```

**Step 2: Check credentials**
```powershell
mysql -u root -p
# If this works, MySQL is fine

# If this fails, you may need to:
# 1. Reset MySQL root password
# 2. Reinstall MySQL
```

**Step 3: Use MySQL Workbench**
- Download: [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- Create connection with credentials from appsettings.json
- Test the connection

---

## 6️⃣ Deployment Issues

### ❌ Can't publish backend

**Solution:**
```powershell
cd pos\backend-dotnet
dotnet publish -c Release -o ./publish

# Check for errors in output
# Common issues:
# - Missing dependencies
# - Database connection string not set
# - Port already in use on target server
```

---

## 🆘 Still Stuck?

### Get More Debug Info:

**Backend debug logs:**
```powershell
cd pos\backend-dotnet
dotnet run --verbose
```

**Frontend debug logs:**
```powershell
cd pos
npm run dev -- --debug
```

**Check all running processes:**
```powershell
netstat -ano | grep -E ":(5000|5173)"
```

**Export backend logs:**
```powershell
# Start backend and redirect output to file
cd pos\backend-dotnet
dotnet run > backend.log 2>&1
```

### Collect diagnostic info:
1. Backend errors (copy-paste from terminal)
2. Frontend console errors (F12 → Console)
3. Network errors (F12 → Network)
4. Database status (MySQL Workbench)
5. Your OS & .NET version (`dotnet --version`)

---

## 📞 Quick Reference

| Issue | Command |
|-------|---------|
| Check .NET | `dotnet --version` |
| Check Node | `node --version` |
| Check MySQL | `mysql -u root -p` |
| Check port 5000 | `netstat -ano \| findstr :5000` |
| Kill process | `taskkill /PID <PID> /F` |
| Backend logs | Check terminal output |
| Frontend logs | F12 → Console |
| DB Logs | MySQL Workbench |

---

**Last Updated:** 2024  
**Status:** ✅ Ready for Development & Debugging
