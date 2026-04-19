# ⚡ Step-by-Step Execution Guide

## 🚀 FASTEST WAY TO GET RUNNING (5 minutes)

### Prerequisites (One-time setup)
- ✅ .NET 7 installed
- ✅ Node.js 16+ installed  
- ✅ MySQL running with database created

---

## 📊 Database Setup (One-time)

### Open MySQL Console
```powershell
mysql -u root -p
```
Enter password: `Sarthak@16`

### Create Database & Tables
```sql
CREATE DATABASE cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafe;

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  pwd VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  c_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  floor VARCHAR(100) NOT NULL,
  capacity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userid) REFERENCES user(id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50),
  items LONGTEXT,
  total_amount DECIMAL(10, 2),
  paying_status VARCHAR(50),
  session_id INT,
  payment_method VARCHAR(50),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

exit;
```

✅ **Database ready!**

---

## 🎯 DAILY STARTUP (Every time you want to run)

### Option 1️⃣: Using Batch File (EASIEST)
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos"
.\start-all.bat
```
This opens 2 windows automatically!

---

### Option 2️⃣: Using PowerShell Script
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos"
.\start-all.ps1
```
This opens 2 windows automatically!

---

### Option 3️⃣: Manual (Open 2 terminals side-by-side)

#### Terminal 1 - Backend
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos\backend-dotnet"
dotnet run
```

Wait for:
```
info: Microsoft.Hosting.Lifetime[14]
	  Now listening on: http://localhost:5000
```

#### Terminal 2 - Frontend
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos"
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:5173/
```

---

## ✅ Verify Everything is Running

### Backend Check
```powershell
# In any new PowerShell window:
curl http://localhost:5000/api/items
# Should see JSON response or error (not "connection refused")
```

### Frontend Check
```powershell
# Open browser:
http://localhost:5173
# Should see login page
```

---

## 🧪 Test the Application

### 1. Signup
- Email: `test@example.com`
- Password: `password123`
- Click "Create Account"

### 2. Should see:
- ✅ No errors in browser console (F12)
- ✅ Token stored in localStorage
- ✅ Redirects to dashboard

### 3. Test an API call
```powershell
# In browser console (F12):
const token = localStorage.getItem('authToken');
const res = await fetch('http://localhost:5000/api/items', {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log(await res.json());
```

Should return array of items (or empty if DB is empty)

---

## 📝 Common Commands

### View Backend Logs
```powershell
cd C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos\backend-dotnet
dotnet run
# Logs appear in terminal
```

### View Frontend Logs
```powershell
# Open browser DevTools: F12
# Go to Console tab
# You'll see any errors/warnings
```

### Rebuild Backend
```powershell
cd C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos\backend-dotnet
dotnet clean
dotnet restore
dotnet build
```

### Reinstall Frontend
```powershell
cd C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos
rm node_modules package-lock.json
npm install
```

### Check if ports are in use
```powershell
netstat -ano | findstr :5000    # Backend port
netstat -ano | findstr :5173    # Frontend port
```

### Kill a process using a port
```powershell
# Example: Kill process on port 5000
# First get PID from previous command
taskkill /PID 1234 /F            # Replace 1234 with actual PID
```

---

## 🎯 Quick Testing Checklist

- [ ] Backend runs without errors
- [ ] Frontend loads on http://localhost:5173
- [ ] Can create new account
- [ ] Token appears in localStorage
- [ ] Can see dashboard
- [ ] Browser console has no errors
- [ ] MySQL database has user table
- [ ] Can query `/api/items` endpoint

---

## 🛑 Stop Everything

```powershell
# In Backend terminal:
Ctrl + C

# In Frontend terminal:
Ctrl + C
```

---

## 📚 Full Documentation

- **Setup**: `pos/QUICKSTART.md`
- **Troubleshooting**: `pos/TROUBLESHOOTING.md`
- **API Reference**: `pos/QUICKSTART.md` (Endpoints section)

---

## 🚀 For Production

### Build Backend
```powershell
cd pos\backend-dotnet
dotnet publish -c Release -o ./publish
# Deploy publish/ folder
```

### Build Frontend
```powershell
cd pos
npm run build
# Deploy dist/ folder
```

---

**Ready to run? Start with Option 1 or 2 above! 🎉**
