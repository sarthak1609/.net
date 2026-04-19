# 🎯 QUICK REFERENCE CARD

Print this or keep open while developing!

---

## 🚀 START YOUR DAY

```powershell
cd "C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos"
.\start-all.bat

# Then open: http://localhost:5173
```

---

## 📍 PORTS TO REMEMBER

```
Frontend API:   http://localhost:5173
Backend API:    http://localhost:5000
MySQL Database: localhost:3306
```

---

## 📂 KEY FOLDERS

```
Frontend:  C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos
Backend:   C:\Users\SARTHAK\projects\pos-cafe\odoo-cafe-pos\pos\backend-dotnet
Database:  MySQL (cafe)
```

---

## 🔌 API ENDPOINTS (With JWT)

### Auth
```
POST /api/auth/login        {email, password} → {token, user}
POST /api/auth/signup       {username, email, password} → {token, user}
```

### Products
```
GET  /api/items             → [products]
POST /api/products          {name, price, ...} → {message, product}
```

### Tables
```
GET  /api/tables            → [tables]
POST /api/tables            {floor, capacity} → {message}
```

### Orders
```
GET  /api/orders            → [orders]
POST /api/orders            {items, total, ...} → {message, orderId}
POST /api/orders/status     {id, status} → {message}
POST /api/orders/update     {id, paying_status} → {message}
```

### Categories
```
GET  /api/category          → [categories]
POST /api/category          {name} → {message}
```

### Other
```
GET  /api/payments          → [payments]
GET  /api/user              → [users]
```

---

## 🔐 AUTHENTICATION

### How it works
1. User logs in with email + password
2. Backend generates JWT token (24 hours)
3. Frontend stores token in localStorage
4. All requests include: `Authorization: Bearer <token>`
5. Token expires → auto-logout

### Check token in browser
```javascript
// F12 console:
localStorage.getItem('authToken')
```

---

## 🐛 QUICK TROUBLESHOOTING

| Problem | Quick Fix |
|---------|-----------|
| Backend won't start | `netstat -ano \| findstr :5000` → kill process |
| Frontend won't load | Hard refresh: Ctrl+Shift+R |
| API returns 401 | Login again |
| MySQL error | Check: `net start MySQL80` |
| Module not found | Run: `npm install` |
| Port in use | `taskkill /PID <PID> /F` |

---

## 📋 DAILY CHECKLIST

```
☐ Run start-all.bat
☐ Wait for "listening on :5000" + "Local: :5173"
☐ Open http://localhost:5173
☐ Test login
☐ Check F12 console for errors
☐ You're good to go!
```

---

## 💻 USEFUL COMMANDS

```powershell
# Start backend
cd pos\backend-dotnet
dotnet run

# Start frontend
cd pos
npm run dev

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Check .NET version
dotnet --version

# Check Node version
node --version

# Reinstall npm packages
cd pos
rm node_modules package-lock.json
npm install
```

---

**Print or bookmark this page!**

**Quick Links:**
- Start: `start-all.bat`
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Need Help: TROUBLESHOOTING.md
