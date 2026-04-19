# POS Cafe - Setup & Deployment Guide

## Project Structure
```
odoo-cafe-pos/
├── pos/                          # React Frontend (Vite)
│   ├── src/                      # React components & views
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── vite.config.js
│
└── pos/backend-dotnet/           # .NET 7 Web API Backend
	├── Program.cs                # API endpoints & configuration
	├── Database.cs               # Dapper ORM helper
	├── Controllers/
	│   └── AuthController.cs    # JWT Authentication
	├── appsettings.json         # JWT & DB configuration
	├── PosBackend.csproj        # Project file
	└── obj/, bin/               # Build output (ignored)
```

---

## Prerequisites

### For Backend (.NET 7)
- **.NET 7 SDK** → [Download](https://dotnet.microsoft.com/download/dotnet/7.0)
- **MySQL 5.7+** → Running locally with database `cafe`
- **Verify Installation:**
  ```powershell
  dotnet --version
  mysql --version
  ```

### For Frontend (React + Vite)
- **Node.js 16+** → [Download](https://nodejs.org/)
- **npm or yarn**
- **Verify Installation:**
  ```powershell
  node --version
  npm --version
  ```

---

## Database Setup

1. **Create the Database:**
   ```sql
   CREATE DATABASE cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE cafe;
   ```

2. **Create Tables** (Run these in MySQL):
   ```sql
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
   ```

---

## Backend Setup (.NET)

### Step 1: Navigate to Backend Directory
```powershell
cd C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos\backend-dotnet
```

### Step 2: Restore NuGet Packages
```powershell
dotnet restore
```

### Step 3: Update Database Connection (if needed)
Edit `appsettings.json`:
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

### Step 4: Run the Backend API
```powershell
dotnet run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
	  Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
	  Application started.
```

---

## Frontend Setup (React)

### Step 1: Navigate to Frontend Directory
```powershell
cd C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Environment Configuration
Verify `.env` file exists with:
```
VITE_API_BASE_URL=http://localhost:5000
```

### Step 4: Run the Development Server
```powershell
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

---

## Complete Startup Script (All-in-One)

### Windows PowerShell (Run 2 separate terminals)

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos\backend-dotnet"
dotnet run
```

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos"
npm run dev
```

Then open browser: **http://localhost:5173**

---

## API Endpoints

### Authentication
- **POST** `/api/auth/login` → Login with JWT token
- **POST** `/api/auth/signup` → Create new user with JWT token

### Products
- **GET** `/api/items` → Fetch all products
- **POST** `/api/products` → Add new product

### Tables
- **GET** `/api/tables` → Fetch all tables
- **POST** `/api/tables` → Add new table

### Orders
- **GET** `/api/orders` → Fetch all orders
- **POST** `/api/orders` → Create new order
- **POST** `/api/orders/status` → Update order status
- **POST** `/api/orders/update` → Update payment status

### Categories
- **GET** `/api/category` → Fetch all categories
- **POST** `/api/category` → Add new category

### Payments
- **GET** `/api/payments` → Fetch payment methods & totals

### Users
- **GET** `/api/user` → Fetch all users

---

## Authentication Flow

1. **Signup/Login** → User sends `email` + `password`
2. **Backend** → Validates & generates JWT token
3. **Frontend** → Stores token in `localStorage` as `authToken`
4. **API Calls** → Include `Authorization: Bearer <token>` header
5. **Expired Token** → Auto-redirects to login

---

## Troubleshooting

### Backend won't start
```powershell
# Clear cache & rebuild
dotnet clean
dotnet build
dotnet run
```

### MySQL Connection Error
```powershell
# Check MySQL service is running
mysql -u root -p
# If password is wrong, update appsettings.json
```

### Frontend API calls fail
- Verify `.env` file has `VITE_API_BASE_URL=http://localhost:5000`
- Clear browser cache: `Ctrl+Shift+Delete`
- Restart both dev servers

### Port 5000 already in use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill process (replace PID with actual ID)
taskkill /PID <PID> /F
```

---

## Production Deployment

### Backend (.NET)
1. Build release: `dotnet publish -c Release`
2. Deploy to IIS or Docker
3. **Change JWT Secret** in `appsettings.json`
4. Enable HTTPS in production

### Frontend (React)
1. Build: `npm run build`
2. Deploy `dist/` folder to web server
3. Update `VITE_API_BASE_URL` to production API URL

---

## Project Files Removed
- ❌ `pos/backend/server.js` (Node.js)
- ❌ `pos/backend/auth.js`
- ❌ `pos/backend/db.js`
- ❌ `pos/backend/config/database.js`

✅ **Replaced with:** `pos/backend-dotnet/` (.NET 7 Web API)

---

## Questions or Issues?
- Check backend logs: Terminal where `dotnet run` is executing
- Check frontend logs: Browser DevTools (F12)
- Verify MySQL is running: `mysql -u root -p`
