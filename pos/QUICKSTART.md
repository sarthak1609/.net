# 🚀 POS Cafe - Complete Setup & Execution Guide

## ✅ What Was Done

### Backend Migration
✅ Removed: `pos/backend/` (Node.js)  
✅ Created: `pos/backend-dotnet/` (.NET 7 Web API with JWT Authentication)  
✅ Database: MySQL with Dapper ORM  
✅ Port: **5000** (matches frontend expectations)

### Frontend Refactoring
✅ Environment variables: `.env` file with `VITE_API_BASE_URL`  
✅ API Client: Centralized `/src/utils/api.js`  
✅ JWT Token Storage: localStorage  
✅ Auth Integration: Updated `AuthView.jsx`

---

## 📋 Prerequisites Check

### 1. .NET 7 SDK
```powershell
dotnet --version
# Expected: 7.x.x
```
If not installed: [Download .NET 7](https://dotnet.microsoft.com/download/dotnet/7.0)

### 2. Node.js 16+
```powershell
node --version
npm --version
# Expected: v16+ and npm 8+
```
If not installed: [Download Node.js](https://nodejs.org/)

### 3. MySQL 5.7+
```powershell
mysql --version
# Expected: 5.7 or higher
```
If not installed: [Download MySQL](https://dev.mysql.com/downloads/mysql/)

---

## 🗄️ Database Setup

### Step 1: Open MySQL Console
```powershell
mysql -u root -p
# Enter password: Sarthak@16
```

### Step 2: Create Database & Tables
```sql
CREATE DATABASE cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafe;

-- Users Table
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  pwd VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  c_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables/Seating
CREATE TABLE tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  floor VARCHAR(100) NOT NULL,
  capacity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions (User Sessions)
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userid) REFERENCES user(id)
);

-- Orders
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

-- Exit MySQL
exit;
```

---

## 🔧 Backend Setup (.NET 7)

### Step 1: Open Backend Directory
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos\backend-dotnet"
```

### Step 2: Verify Configuration
Edit `appsettings.json` (optional, already configured):
```json
{
  "Database": {
	"ConnectionString": "Server=localhost;User ID=root;Password=Sarthak@16;Database=cafe;"
  },
  "Jwt": {
	"Secret": "your-super-secret-key-change-this-in-production-12345678901234567890",
	"Issuer": "pos-cafe",
	"Audience": "pos-cafe-users"
  }
}
```

### Step 3: Restore & Build
```powershell
dotnet restore
dotnet build
```

### Step 4: Run Backend API
```powershell
dotnet run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
	  Now listening on: http://localhost:5000
```

✅ **Backend is now running on port 5000**

---

## ⚛️ Frontend Setup (React + Vite)

### Step 1: Open Frontend Directory (NEW TERMINAL)
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos"
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Verify Environment
Check `.env` file exists:
```
VITE_API_BASE_URL=http://localhost:5000
```

### Step 4: Run Development Server
```powershell
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

✅ **Frontend is now running on port 5173**

---

## 🎯 Quick Start (All Steps)

### Terminal 1 - Backend
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos\backend-dotnet"
dotnet run
```

### Terminal 2 - Frontend
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos"
npm run dev
```

### Then:
1. Open browser: **http://localhost:5173**
2. Sign up with: email & password
3. Token automatically stored in localStorage
4. Enjoy! 🎉

---

## 🔌 API Endpoints Reference

All endpoints require `Authorization: Bearer <token>` header (auto-handled by ApiClient)

### Authentication
- `POST /api/auth/signup` → Create user + get JWT
- `POST /api/auth/login` → Login + get JWT

### Products
- `GET /api/items` → List all products
- `POST /api/products` → Add new product

### Tables/Seating
- `GET /api/tables` → List all tables
- `POST /api/tables` → Add table

### Orders
- `GET /api/orders` → List orders
- `POST /api/orders` → Create order
- `POST /api/orders/status` → Update order status
- `POST /api/orders/update` → Update payment status

### Categories
- `GET /api/category` → List categories
- `POST /api/category` → Add category

### Payments
- `GET /api/payments` → Payment summary

### Users
- `GET /api/user` → List users

---

## 🐛 Troubleshooting

### Issue: Backend won't start
```powershell
# Solution: Clean and rebuild
cd pos/backend-dotnet
dotnet clean
dotnet build
dotnet run
```

### Issue: MySQL connection error
```powershell
# Solution: Check MySQL is running and credentials are correct
mysql -u root -p
# If error, verify password in appsettings.json
```

### Issue: Frontend can't connect to API
```powershell
# Solution: 
# 1. Verify backend is running on port 5000
# 2. Check .env has VITE_API_BASE_URL=http://localhost:5000
# 3. Hard refresh browser (Ctrl+Shift+R)
```

### Issue: Port 5000 already in use
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Issue: "Cannot find module" in frontend
```powershell
cd pos
npm install
npm run dev
```

---

## 📊 Project Structure

```
odoo-cafe-pos/
├── pos/
│   ├── .env                          # Frontend env vars
│   ├── SETUP_GUIDE.md               # This file
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── utils/
│   │   │   └── api.js               # API client with JWT
│   │   ├── views/
│   │   │   ├── AuthView.jsx         # Login/Signup (JWT enabled)
│   │   │   ├── DashboardView.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── backend-dotnet/              # NEW: .NET 7 Backend
│       ├── appsettings.json         # DB & JWT config
│       ├── Program.cs               # API endpoints
│       ├── Database.cs              # Dapper helper
│       ├── PosBackend.csproj
│       └── Controllers/
│           └── AuthController.cs    # JWT auth logic
```

---

## 🚀 Production Deployment

### Backend (.NET)
```powershell
# Build for production
dotnet publish -c Release -o ./publish

# Deploy publish/ folder to:
# - IIS on Windows
# - Docker container
# - Azure / AWS
```

**⚠️ IMPORTANT:**
- Change `Jwt:Secret` in `appsettings.json`
- Enable HTTPS (use SSL certificate)
- Update `CORS` policy if deploying to different domain

### Frontend (React)
```powershell
# Build for production
npm run build

# Deploy dist/ folder to:
# - Nginx / Apache
# - S3 (AWS)
# - Vercel / Netlify
# - Any static hosting
```

**⚠️ Update VITE_API_BASE_URL:**
```
VITE_API_BASE_URL=https://your-api-domain.com
```

---

## ✨ Key Features Added

### Backend (.NET)
- ✅ JWT Authentication (24-hour tokens)
- ✅ Dapper ORM for SQL queries
- ✅ CORS enabled for frontend
- ✅ All original endpoints ported
- ✅ Error handling & validation

### Frontend (React)
- ✅ Centralized API client
- ✅ JWT token storage in localStorage
- ✅ Environment variable configuration
- ✅ Auth form with error handling
- ✅ Auto-logout on token expiry

---

## 📝 Files Changed/Created

### Removed
- ❌ `pos/backend/server.js`
- ❌ `pos/backend/auth.js`
- ❌ `pos/backend/db.js`
- ❌ `pos/backend/config/database.js`

### Created
- ✅ `pos/backend-dotnet/Program.cs`
- ✅ `pos/backend-dotnet/Database.cs`
- ✅ `pos/backend-dotnet/Controllers/AuthController.cs`
- ✅ `pos/backend-dotnet/appsettings.json`
- ✅ `pos/backend-dotnet/.gitignore`
- ✅ `pos/.env`
- ✅ `pos/src/utils/api.js`
- ✅ `pos/SETUP_GUIDE.md`

### Modified
- ✅ `pos/src/views/AuthView.jsx` (JWT integration)
- ✅ `pos/backend-dotnet/PosBackend.csproj` (JWT packages)

---

## 🎓 Next Steps

1. ✅ Start both servers (backend + frontend)
2. ✅ Test signup/login flow
3. ✅ Verify JWT tokens in browser DevTools
4. ✅ Test all API endpoints
5. ✅ Configure production deployment
6. ✅ Add more features as needed

---

## 📞 Support

- Backend Logs: Check terminal where `dotnet run` executes
- Frontend Logs: Press F12 in browser → Console
- Database Issues: Use MySQL Workbench GUI
- API Testing: Use Postman or Insomnia

---

**Last Updated:** 2024  
**Status:** ✅ Ready for Development
