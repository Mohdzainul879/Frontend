# 🚀 Quick Start Guide - Campus Food Intelligence System

This guide will help you get the entire system (Backend + Frontend) up and running in minutes.

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- [ ] **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- [ ] **Git** - [Download](https://git-scm.com/)
- [ ] A code editor (VS Code recommended)

### Verify Installation

Open a terminal and run:
```bash
node --version   # Should show v16.x.x or higher
npm --version    # Should show 8.x.x or higher
mongod --version # Should show 5.x.x or higher
```

## 🎯 Step-by-Step Setup

### Step 1: Start MongoDB

**Windows:**
```powershell
# Open PowerShell as Administrator
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### Step 2: Clone & Setup Backend

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Seed the database with sample data
npm run seed
```

**Expected output:**
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
🗑️  Clearing existing data...
✅ Existing data cleared
👥 Creating users...
✅ Created 11 users
📋 Creating menus...
✅ Created 42 menus
🎫 Creating bookings...
✅ Created bookings
🎉 Database seeded successfully!
```

### Step 3: Start Backend Server

**In the Backend folder:**
```bash
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
```

✅ **Backend is now running at http://localhost:5000**

### Step 4: Setup Frontend

**Open a NEW terminal** (keep the backend running) and navigate to the project root:

```bash
# Go back to project root
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Step 5: Start Frontend

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Frontend is now running at http://localhost:5173**

## 🎉 You're All Set!

Open your browser and go to **http://localhost:5173**

### Login Credentials

**Admin Account:**
- Email: `admin@campus.com`
- Password: `admin123`

**Student Account:**
- Email: `student@campus.com`
- Password: `student123`

## 🧪 Testing the System

### 1. Test Admin Features:
1. Login as admin
2. View dashboard with analytics
3. Check student management
4. View prediction dashboard
5. Manage menus

### 2. Test Student Features:
1. Login as student
2. View dashboard
3. Book a meal
4. Check booking history
5. View profile

## 📁 Project Structure

```
Campus-Food-Intelligence-System/
├── Backend/              ← Backend API (Port 5000)
│   ├── controllers/     ← Business logic
│   ├── models/         ← Database models
│   ├── routes/         ← API endpoints
│   ├── middleware/     ← Auth & validation
│   └── server.js       ← Entry point
│
├── src/                 ← Frontend React App (Port 5173)
│   ├── components/     ← Reusable components
│   ├── context/        ← State management
│   ├── pages/          ← Page components
│   └── services/       ← API integration
│
└── README.md           ← Documentation
```

## 🔧 Common Issues & Quick Fixes

### Backend won't start

**Issue:** `MongoDB connection error`
```bash
# Solution: Make sure MongoDB is running
net start MongoDB  # Windows
brew services start mongodb-community  # Mac
```

**Issue:** `Port 5000 already in use`
```bash
# Solution: Change port in Backend/.env
PORT=5001
```

### Frontend won't start

**Issue:** `Port 5173 already in use`
```bash
# Solution: Vite will automatically suggest another port - just press Y
```

**Issue:** `API connection error`
```bash
# Solution: Make sure backend is running on port 5000
# Check Backend/.env and frontend .env have matching URLs
```

### Can't login

**Issue:** `Invalid credentials`
```bash
# Solution: Re-seed the database
cd Backend
npm run seed
```

## 🛠️ Development Workflow

### Making Changes

**Backend Changes:**
1. Edit files in `Backend/`
2. Server auto-restarts (using nodemon)
3. Test at http://localhost:5000/api

**Frontend Changes:**
1. Edit files in `src/`
2. Browser auto-refreshes (HMR)
3. View at http://localhost:5173

### Stopping the Servers

```bash
# In each terminal, press:
Ctrl + C
```

### Starting Again

**Terminal 1 (Backend):**
```bash
cd Backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## 📊 Available Scripts

### Backend (in Backend/ folder)
```bash
npm start       # Production mode
npm run dev     # Development with auto-reload
npm run seed    # Populate database with sample data
```

### Frontend (in root folder)
```bash
npm run dev     # Development server
npm run build   # Build for production
npm run preview # Preview production build
```

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api`

**Public:**
- `GET /health` - API health check

**Auth:**
- `POST /auth/login` - User login
- `POST /auth/register` - Student registration
- `GET /auth/me` - Current user info

**Menus:**
- `GET /menus` - All menus
- `GET /menus/date/:date` - Menus by date

**Bookings:**
- `GET /bookings/my-bookings` - My bookings
- `POST /bookings` - Create booking
- `PUT /bookings/:id/cancel` - Cancel booking

See Backend/README.md for complete API documentation.

## 📚 Next Steps

1. ✅ Explore the admin dashboard
2. ✅ Try booking meals as a student
3. ✅ Check analytics and predictions
4. ✅ Customize the code for your needs
5. ✅ Read the full documentation

## 🆘 Need Help?

1. **Check logs** in the terminal for error messages
2. **Verify MongoDB** is running
3. **Ensure ports** 5000 and 5173 are free
4. **Check .env** files are configured correctly
5. **Open an issue** on GitHub if problem persists

## 🎓 Learning Resources

- **MongoDB**: https://docs.mongodb.com/
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/

## ⚡ Pro Tips

1. **Use two terminals** - one for backend, one for frontend
2. **Keep MongoDB running** - don't stop the service
3. **Check logs** - they show helpful error messages
4. **Use browser DevTools** - Network tab shows API calls
5. **MongoDB Compass** - GUI tool to view database

## 🎯 Success Indicators

✅ Backend shows: `Server running on port 5000`
✅ Backend shows: `MongoDB connected successfully`
✅ Frontend shows: `Local: http://localhost:5173/`
✅ Browser opens without errors
✅ You can login successfully
✅ Data loads on the dashboard

---

**Congratulations! 🎊 Your Campus Food Intelligence System is now running!**

Happy coding! 💻
