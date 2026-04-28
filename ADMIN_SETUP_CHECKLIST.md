# 🚀 Quick Setup Checklist - Admin Registration

## ✅ Pre-Setup (System Administrator)

- [ ] **MongoDB Running**
  - Ensure MongoDB is installed and running
  - Verify connection: `mongosh` command works
  - Check database exists

- [ ] **Backend Environment File Created**
  - Location: `Backend/.env`
  - Contains all required variables:
    ```
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/campus-food-db (or remote)
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRE=7d
    NODE_ENV=development
    CLIENT_URL=http://localhost:5173
    ADMIN_REGISTRATION_KEY=your_secure_key_here
    ```

- [ ] **Admin Registration Key Generated**
  - Use strong, random key (16+ characters)
  - Store in Backend/.env
  - Share securely with new admins

## 🔧 Installation (System Administrator)

```bash
# 1. Backend Setup
cd Backend
npm install
npm run seed          # Optional: seed with demo data
npm start             # Backend runs on port 5000

# 2. Frontend Setup (new terminal)
cd ..
npm install
npm run dev          # Frontend runs on port 5173
```

## 📝 Create First Admin Account

### Option A: Via Web Interface (Recommended)

1. Open browser: `http://localhost:5173/admin/register`
2. Fill registration form:
   - **Full Name:** Your full name
   - **Email:** admin@campus.com
   - **Department:** Operations / Management (your choice)
   - **Password:** Strong password (8+ chars, 1 upper, 1 number)
   - **Confirm Password:** Same as above
   - **Admin Key:** Your ADMIN_REGISTRATION_KEY from .env
3. Click "Create Admin Account"
4. ✅ Automatically logged in!
5. ✅ Redirected to admin dashboard

### Option B: Via Database (Direct)

You can also pre-create admin accounts directly in MongoDB:

```bash
mongosh

# In MongoDB shell:
use campus-food-db

db.users.insertOne({
  name: "Admin Name",
  email: "admin@campus.com",
  password: "$2a$10$...", // bcrypt hashed password
  role: "admin",
  department: "Operations",
  isActive: true
})
```

## ✅ Post-Setup Verification

- [ ] Backend Server Running
  - Check terminal: "Server running on port 5000"
  - Test endpoint: `curl http://localhost:5000/api`

- [ ] Frontend Server Running
  - Check terminal: showing Vite server info
  - Browser: `http://localhost:5173` loads

- [ ] Admin Registration Works
  - Navigate to `/admin/register`
  - Form displays correctly
  - All fields render properly

- [ ] Admin Can Register
  - Complete registration form
  - Receives success message or redirects
  - Appears in MongoDB

- [ ] Admin Can Login
  - Navigate to `/admin/login`
  - Enter new admin credentials
  - Successfully logs in

- [ ] Admin Dashboard Accessible
  - Can see menu management
  - Can see student management
  - Can see analytics & predictions
  - Can see prediction dashboard

## 📊 Database Verification

Verify admin account created correctly:

```bash
mongosh
use campus-food-db
db.users.findOne({ email: "admin@campus.com" })
```

Expected output:
```json
{
  "_id": ObjectId("..."),
  "name": "Admin Name",
  "email": "admin@campus.com",
  "password": "$2a$10$...",  // hashed
  "role": "admin",
  "department": "Operations",
  "isActive": true,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## 🔐 Security Setup

- [ ] Change Default Admin Password
  - First login with demo account
  - Navigate to Profile page
  - Update password to unique value
  - Logout and re-login to confirm

- [ ] Update Admin Registration Key
  - Change ADMIN_REGISTRATION_KEY in Backend/.env
  - Restart backend server
  - Test with new key
  - Don't commit .env to version control

- [ ] Disable/Remove Demo Admin (Optional)
  - Find admin account in database
  - Set `isActive: false`
  - Prevents demo credentials misuse

- [ ] Document Access
  - Record which admins have access
  - Store registration keys securely
  - Keep audit trail

## 🧪 Test Admin Workflows

### Create New Admin (for team)

1. Generate random key:
   ```bash
   # Windows PowerShell
   [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   
   # Mac/Linux
   openssl rand -base64 32
   ```

2. Share registration link + key
   - URL: `http://your-domain.com/admin/register`
   - Key: (secure channel)
   - Get them to register themselves

3. Verify admin created
   - Check database for new user
   - Test login with new credentials

### Test Admin Features

- [ ] Menu Management
  - Create new menu
  - Edit menu items
  - Delete menu
  - See all menus

- [ ] Student Management
  - View all students list
  - Search for student
  - Edit student info
  - View student details

- [ ] Analytics Dashboard
  - View real-time analytics
  - Check heatmaps
  - See efficiency scores
  - Check sustainability metrics

- [ ] Prediction Dashboard
  - View demand predictions
  - See forecast data
  - Check confidence levels
  - Review anomalies

## 🆘 Common Issues

### "Invalid or missing admin registration key"
- [ ] Check key matches exactly in Backend/.env
- [ ] Restart backend after changing .env
- [ ] Check for spaces/special characters
- [ ] Verify no typos in key

### "User already exists with this email"
- [ ] Use different email address
- [ ] Or delete account from database:
  ```bash
  db.users.deleteOne({ email: "admin@campus.com" })
  ```

### "Cannot reach backend" / API errors
- [ ] Verify backend running: `npm start` from Backend/
- [ ] Check API URL in `src/services/api.js`
- [ ] Check VITE_API_URL if set
- [ ] Verify CORS settings in backend

### "Admin can't access dashboard"
- [ ] Check browser console for errors (F12)
- [ ] Verify token in localStorage (DevTools → Storage)
- [ ] Check user role is 'admin' in database
- [ ] Verify ProtectedRoute component

## 📚 Documentation

For detailed information, refer to:
- [ADMIN_REGISTRATION_GUIDE.md](./ADMIN_REGISTRATION_GUIDE.md) - Full setup guide
- [ADMIN_REGISTRATION_IMPLEMENTATION.md](./ADMIN_REGISTRATION_IMPLEMENTATION.md) - Implementation details
- [README.md](./README.md) - Project overview
- Backend routes: `Backend/routes/auth.routes.js`
- Frontend component: `src/pages/admin/AdminRegister.jsx`

## 🎯 Success Criteria

Your admin registration is working correctly when:

✅ Admin can navigate to `/admin/register`
✅ Registration form is displayed and functional
✅ Admin can complete registration with correct credentials
✅ System validates the admin registration key
✅ New admin account is created in database
✅ Admin is automatically logged in after registration
✅ Admin redirected to `/admin/dashboard`
✅ Admin can access all protected admin pages
✅ Admin can login again with saved credentials
✅ Dashboard shows all admin features

## 💡 Pro Tips

1. **Batch Create Admins**
   - Generate multiple keys
   - Share registration link with team
   - Let them self-register

2. **Team Notifications**
   - Email admins registration link
   - Include setup instructions
   - Provide support contact

3. **Monitor Registrations**
   - Check database for new users
   - Verify all admins are created
   - Remove test accounts before production

4. **Secure Operations**
   - Rotate registration keys periodically
   - Deactivate unused admin accounts
   - Keep audit log of admin activities
   - Use strong, unique passwords

## 📞 Support

If issues persist:
1. Check browser console errors (F12)
2. Review backend terminal for error logs
3. Check MongoDB connection status
4. Verify all .env variables set correctly
5. See troubleshooting in guides above

---

**Setup Status:** Ready for Admin Registration ✓

**Next Steps:** 
1. Complete this checklist
2. Test all admin workflows
3. Train admin team on system usage
4. Monitor first week of operations
