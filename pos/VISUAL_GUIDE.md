# 📺 Visual Quick Reference Guide

## 🎯 THE SIMPLEST WAY TO START

### ONE-CLICK STARTUP

**Windows Users - Double-click this file:**
```
pos/start-all.bat
```

OR open PowerShell and run:
```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos"
.\start-all.ps1
```

✅ This automatically starts both backend and frontend!

---

## 📱 Access Points

```
┌─────────────────────────────────────┐
│   What                  URL         │
├─────────────────────────────────────┤
│   React App      http://localhost:5173  │
│   Backend API    http://localhost:5000  │
│   MySQL         localhost:3306       │
└─────────────────────────────────────┘
```

---

## 🔄 Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│ USER OPENS: http://localhost:5173                                │
└──────────────────────────────────────────────────────────────────┘
							↓
				   ┌─────────────────┐
				   │  Login Screen   │
				   └─────────────────┘
							↓
			  ┌──────────────────────────────┐
			  │ User enters:                  │
			  │  • Email                      │
			  │  • Password                   │
			  │  • Click "Sign In" or "Sign  │
			  │    Up"                        │
			  └──────────────────────────────┘
							↓
	 ┌────────────────────────────────────────────┐
	 │ Frontend sends to backend:                  │
	 │ POST /api/auth/login                        │
	 │ { email, password }                         │
	 └────────────────────────────────────────────┘
							↓
	 ┌────────────────────────────────────────────┐
	 │ Backend validates:                          │
	 │ 1. Check user exists in MySQL               │
	 │ 2. Check password matches                   │
	 │ 3. Generate JWT token                       │
	 │ 4. Return token                             │
	 └────────────────────────────────────────────┘
							↓
	 ┌────────────────────────────────────────────┐
	 │ Frontend receives token and:                │
	 │ 1. Stores in localStorage                   │
	 │ 2. Stores user info in localStorage         │
	 │ 3. Redirects to Dashboard                   │
	 └────────────────────────────────────────────┘
							↓
				   ┌─────────────────┐
				   │  Dashboard      │
				   │  (App Content)  │
				   └─────────────────┘
							↓
	 ┌────────────────────────────────────────────┐
	 │ All future API calls include:               │
	 │ Authorization: Bearer <JWT_TOKEN>           │
	 │                                              │
	 │ Backend validates token and responds         │
	 └────────────────────────────────────────────┘
							↓
	 ┌────────────────────────────────────────────┐
	 │ When user logs out:                         │
	 │ 1. Clear localStorage                       │
	 │ 2. Redirect to Login                        │
	 └────────────────────────────────────────────┘
```

---

## 📂 File Organization

```
YOUR PROJECT
│
├── 📁 pos/                          ← Frontend (React)
│   ├── 📄 .env                      ← API URL config
│   ├── 📄 package.json              ← Dependencies
│   ├── 📁 src/
│   │   ├── 📁 utils/
│   │   │   └── 📄 api.js            ← API Client
│   │   ├── 📁 views/
│   │   │   ├── 📄 AuthView.jsx      ← Login/Signup
│   │   │   └── 📄 DashboardView.jsx ← Main app
│   │   └── 📄 App.jsx               ← Main component
│   │
│   ├── 📁 backend-dotnet/           ← Backend (.NET)
│   │   ├── 📄 Program.cs            ← API endpoints
│   │   ├── 📄 Database.cs           ← DB helper
│   │   ├── 📄 appsettings.json      ← Config
│   │   └── 📁 Controllers/
│   │       └── 📄 AuthController.cs ← JWT auth
│   │
│   ├── 📄 QUICKSTART.md             ← Full guide
│   ├── 📄 RUN_STEPS.md              ← How to run
│   ├── 📄 TROUBLESHOOTING.md        ← Issues
│   ├── 📄 start-all.bat             ← Windows starter
│   └── 📄 start-all.ps1             ← PowerShell starter
│
└── 📁 MySQL Database
	└── 📊 cafe/                     ← Database name
		├── 👥 user                  ← Accounts
		├── 🛒 items                 ← Products
		├── 📦 category              ← Categories
		├── 🪑 tables                ← Seating
		├── 💰 orders                ← Transactions
		└── 📅 sessions              ← User sessions
```

---

## 🎮 Interactive Decision Tree

```
START
  │
  ├─→ First time running?
  │    YES → Go to "DATABASE SETUP" (one-time only)
  │    NO  → Skip to "DAILY STARTUP"
  │
  └─→ DATABASE SETUP
	  │
	  ├─→ Have MySQL installed?
	  │    NO  → Download & install from mysql.com
	  │    YES → Continue
	  │
	  ├─→ Run this in MySQL console:
	  │    • CREATE DATABASE cafe;
	  │    • CREATE 6 tables (see RUN_STEPS.md)
	  │    ✅ Done!
	  │
	  └─→ DAILY STARTUP
		  │
		  ├─→ Method A (Easiest):
		  │    • Double-click pos/start-all.bat
		  │    • Done! 🎉
		  │
		  ├─→ Method B (PowerShell):
		  │    • Open PowerShell
		  │    • Run: .\start-all.ps1
		  │    • Done! 🎉
		  │
		  └─→ Method C (Manual):
			  │
			  ├─→ Terminal 1 (Backend):
			  │    cd pos\backend-dotnet
			  │    dotnet run
			  │    Wait for: "listening on :5000"
			  │
			  └─→ Terminal 2 (Frontend):
				   cd pos
				   npm run dev
				   Wait for: "Local: http://localhost:5173"

				   DONE! Open browser → http://localhost:5173
```

---

## 🔑 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Stop Backend | Ctrl+C (in backend terminal) |
| Stop Frontend | Ctrl+C (in frontend terminal) |
| Browser DevTools | F12 |
| Hard Refresh | Ctrl+Shift+R |
| Clear Cache | Ctrl+Shift+Delete |
| Console (DevTools) | F12 → Console tab |

---

## 🚦 Status Indicators

### Green (Good) ✅
- Backend: `Now listening on: http://localhost:5000`
- Frontend: `Local: http://localhost:5173`
- Browser: No red errors in F12 console
- Login: Token appears in localStorage

### Red (Problem) ❌
- Backend: Port 5000 in use
- Frontend: Module not found
- Browser: CORS error in console
- API: 401 Unauthorized
- Database: Connection refused

---

## 💡 Top 5 Tips

1. **Always check both terminals are running**
   - Terminal 1: Backend (port 5000)
   - Terminal 2: Frontend (port 5173)

2. **Browser won't load?**
   - Hard refresh: Ctrl+Shift+R
   - Clear cache: F12 → Application → Clear Site Data

3. **API call fails?**
   - Check F12 → Network tab
   - Look for 401 (login again)
   - Look for 500 (backend error)

4. **Port already in use?**
   ```powershell
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

5. **Stuck? Check logs**
   - Backend: Terminal output
   - Frontend: F12 Console
   - Database: MySQL Workbench

---

## 📊 System Health Check

Run this checklist every startup:

```
□ MySQL running?
  netstat -ano | findstr :3306

□ .NET 7 installed?
  dotnet --version

□ Node.js installed?
  node --version

□ Port 5000 free?
  netstat -ano | findstr :5000

□ Port 5173 free?
  netstat -ano | findstr :5173

□ Database 'cafe' exists?
  mysql -u root -p cafe
```

---

## 🎯 Typical Session

```
Time    Action                          What You See
─────────────────────────────────────────────────────────
09:00   Double-click start-all.bat      2 windows open
09:02   Backend terminal                "listening on :5000"
09:03   Frontend terminal               "Local: :5173"
09:04   Open http://localhost:5173      Login page appears
09:05   Email: test@example.com         
		Password: password123
		Click "Sign Up"
09:06   Dashboard loads                 You're in the app!
09:15   Make API calls                  See product list
10:00   Click Logout                    Back to login
10:01   Close both terminals            All stopped
```

---

## 🎓 Learning Path

### 1. Understand the Architecture
- Read: COMPLETION_SUMMARY.md (Architecture section)

### 2. Get it Running
- Follow: RUN_STEPS.md (Quick 5-minute guide)

### 3. Test Everything
- Read: QUICKSTART.md (API Endpoints section)
- Use: Postman to test endpoints

### 4. Troubleshoot Issues
- Check: TROUBLESHOOTING.md
- Review: Browser console (F12)
- Review: Terminal output

### 5. Customize
- Edit API endpoints in `Program.cs`
- Edit UI in `src/views/`
- Update database schema

---

## 🎬 Next Actions

```
IMMEDIATE (Now):
→ Start with RUN_STEPS.md
→ Get everything running
→ Test login/signup

NEXT (Today):
→ Explore API endpoints with Postman
→ Test database operations
→ Review code structure

FUTURE (This Week):
→ Add new features
→ Customize UI
→ Deploy to production
```

---

## ✨ You're All Set!

```
╔════════════════════════════════════════════╗
║                                            ║
║  Backend:  ✅ .NET 7 with JWT             ║
║  Frontend: ✅ React + Vite with API       ║
║  Database: ✅ MySQL with 6 tables         ║
║  Docs:     ✅ 5 comprehensive guides      ║
║  Startup:  ✅ One-click batch files       ║
║                                            ║
║         Ready for Development!             ║
║                                            ║
╚════════════════════════════════════════════╝
```

**👉 Start with: `RUN_STEPS.md`**

---

**Created:** 2024  
**Status:** ✅ Complete & Ready
