# Admin Registration System - Setup & Usage Guide

## Overview

The Campus Food Intelligence System now includes a complete admin registration system that allows system administrators to register and manage their accounts through a secure, web-based interface. This guide explains how to set up and use the admin registration feature.

## System Architecture

### Components Implemented

1. **Admin Registration Page** (`/admin/register`)
   - Secure form for admin account creation
   - Real-time password validation
   - Admin registration key requirement
   - Department selection

2. **Backend Admin Registration Endpoint** (`POST /api/auth/register-admin`)
   - Validates admin registration key
   - Creates admin user with proper role assignment
   - Returns JWT token for immediate login

3. **Enhanced Authentication Context**
   - Supports both student and admin registration
   - Detects role and routes to appropriate dashboard

4. **Database Schema Updates**
   - User model includes admin-specific fields
   - Department field support for organization

## Setup Instructions

### 1. Environment Configuration

Set the admin registration key in your backend `.env` file:

```env
ADMIN_REGISTRATION_KEY=ADMIN_SECRET_2024
```

**Security Recommendations:**
- Use a strong, random key (minimum 16 characters)
- Change this key periodically
- Store securely in your deployment environment
- Never commit real keys to version control

For production, generate a secure key:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example secure keys:
- `abc123xyz456def789ghi012jkl345mnopqrst`
- `ADMIN_AUTH_2024_CFIS_SECRET_PRODUCTION_v1`

### 2. Database Preparation

Ensure MongoDB is running and connected. The User model will automatically support both student and admin roles.

```bash
# Start MongoDB locally
mongod

# Or verify remote connection in Backend/.env
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-food-db
```

### 3. Backend Startup

```bash
cd Backend
npm install
npm start
# Backend runs on http://localhost:5000
```

### 4. Frontend Startup

```bash
# Terminal 1: Frontend development server
npm run dev
# Frontend runs on http://localhost:5173
```

## Admin Registration Workflow

### Step 1: Access Admin Registration

Navigate to: `http://localhost:5173/admin/register`

**Quick Access:**
1. Go to `/admin/login` page
2. Click "Create Admin Account →" button
3. You'll be redirected to the registration form

### Step 2: Complete Registration Form

Fill in the following fields:

| Field | Requirements | Example |
|-------|--------------|---------|
| **Full Name** | Required, any name format | Dr. Rajesh Kumar |
| **Email Address** | Valid email, unique in database | admin@campus.com |
| **Department** | Select from dropdown | Operations, Finance, Kitchen, Nutrition, Quality Control, Management |
| **Password** | 8+ chars, 1 uppercase, 1 number | MyPassword123! |
| **Confirm Password** | Must match password field | MyPassword123! |
| **Admin Registration Key** | Provided by system administrator | ADMIN_SECRET_2024 |

### Step 3: Validation & Creation

The form validates:
- ✓ Email follows valid format
- ✓ Password meets security requirements
- ✓ Passwords match
- ✓ All required fields filled
- ✓ Admin registration key is correct

Once validated, the account is created immediately.

### Step 4: Automatic Login & Dashboard Access

Upon successful registration:
- JWT token is generated automatically
- Admin is logged in instantly
- Redirected to `/admin/dashboard`
- Token stored in browser localStorage

## Admin Features Available

Once logged in, admins can access:

### Dashboard (`/admin/dashboard`)
- System overview and statistics
- Quick action cards
- Recent activity

### Menu Management (`/admin/menu`)
- Create, read, update, delete meals
- Manage menu planning
- Set prices and nutritional information

### Student Management (`/admin/students`)
- View all students
- Edit student profiles
- Manage hostel assignments
- Track attendance and accountability

### Prediction Dashboard (`/admin/predictions`)
- Advanced ML-powered meal demand predictions
- 91.8% accuracy ensemble model
- Trend analysis and forecasting
- Confidence intervals and anomaly detection

### Analytics Dashboard (`/admin/analytics`)
- Real-time meal consumption metrics
- Heatmaps by hostel and room
- Comparative analysis
- Efficiency scoring
- Waste reduction insights

## API Endpoints

### Admin Registration
```http
POST /api/auth/register-admin
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@campus.com",
  "password": "SecurePassword123",
  "adminKey": "ADMIN_SECRET_2024",
  "department": "Operations"
}
```

**Response (201 Created):**
```json
{
  "_id": "user_id_here",
  "name": "Admin Name",
  "email": "admin@campus.com",
  "role": "admin",
  "department": "Operations",
  "isAdmin": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// Invalid registration key
{
  "message": "Invalid or missing admin registration key"
}

// User already exists
{
  "message": "User already exists with this email"
}

// Server error
{
  "message": "error details here"
}
```

### Admin Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@campus.com",
  "password": "SecurePassword123"
}
```

## Security Features

### Password Security
- **Minimum 8 characters** required
- **At least 1 uppercase letter** required
- **At least 1 number** required
- **Bcrypt hashing** on storage
- Real-time validation feedback

### Admin Registration Key Validation
- All registrations require valid admin key
- Key stored in environment variable only
- No key exposure in frontend code
- Key validation on every registration

### JWT Token Authentication
- 7-day expiration
- Secure token storage
- Protected routes require admin role
- Token refresh on login

### Database Security
- Unique email constraint
- Admin role assigned at database level
- Encrypted password storage
- Audit timestamp tracking

## Troubleshooting

### Problem: "Invalid or missing admin registration key"

**Solution:**
1. Verify the key matches exactly in `.env`
2. Check for spaces or special characters
3. Ensure Backend/.env is loaded (restart server)
4. Use exact key provided by administrator

### Problem: "User already exists with this email"

**Solution:**
1. Use a different email address
2. Or contact admin to reset the account
3. Check if email was already registered as student

### Problem: Admin can't access dashboard after registration

**Solution:**
1. Check browser console for errors
2. Verify token is stored: Open DevTools → Storage → localStorage → cfis_token
3. Check Backend routes are protected: Review Backend/routes/
4. Ensure admin role is set in database

### Problem: "Cannot reach backend" or API errors

**Solution:**
1. Verify Backend is running: `npm start` from Backend/
2. Check API URL in `src/services/api.js`
3. Verify VITE_API_URL in `.env.local`
4. Check CORS settings in Backend/middleware/

## Default Demo Admin Account

For testing purposes, a demo admin is available:

```
Email: admin@campus.com
Password: admin123
```

⚠️ **IMPORTANT:** Change the password after first login in production!

## Best Practices

### For System Administrators

1. **Use Strong Registration Keys**
   - Generate cryptographically secure keys
   - Change periodically
   - Distribute securely to new admins

2. **Manage Admin Accounts**
   - Review admin list regularly
   - Deactivate unused accounts
   - Audit admin activities

3. **Security Maintenance**
   - Update environment variables
   - Monitor registration attempts
   - Keep system dependencies updated

### For New Admins

1. **Complete Profile Setup**
   - Set accurate department
   - Update profile information
   - Set recovery email if available

2. **Change Default Password**
   - Don't use simple passwords
   - Update demo credentials immediately
   - Enable 2FA if available

3. **Document Access Controls**
   - Record who has admin access
   - Update when admin leaves
   - Maintain audit logs

## Registration Key Management

### Changing the Admin Key

If you need to rotate the admin registration key:

1. Update Backend/.env:
   ```env
   ADMIN_REGISTRATION_KEY=new_secure_key_here
   ```

2. Restart Backend server:
   ```bash
   npm start
   ```

3. Old registrations with invalid key will fail
4. Only new key works for registrations

### Issuing Keys to New Team Members

When onboarding new admins:

1. Generate a strong key
2. Share securely (encrypted email, password manager)
3. Include registration URL: `http://your-domain.com/admin/register`
4. Include this guide
5. Follow up after successful registration

## Advanced Configuration

### Custom Password Requirements

Edit `src/pages/admin/AdminRegister.jsx`:
```jsx
const validate = () => {
  const e = {};
  // Modify password requirements here
  if (form.password.length < 12) e.password = 'Password must be at least 12 characters';
  // Add more validations as needed
};
```

### Custom Departments

Edit:
- `src/pages/admin/AdminRegister.jsx` line 19
- `Backend/models/User.model.js` line 40

Add departments:
```javascript
departments = ['Operations', 'Finance', 'Kitchen', 'Nutrition', 'Quality Control', 'Management', 'YOUR_DEPT'];
```

### Token Expiration

Edit `Backend/utils/generateToken.js`:
```javascript
jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
// Change '7d' to desired expiration
```

## API Integration Examples

### Using Admin Registration in Your App

```javascript
// Frontend - Registering new admin
const response = await fetch('http://localhost:5000/api/auth/register-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Admin',
    email: 'newadmin@campus.com',
    password: 'SecurePass123',
    adminKey: 'ADMIN_SECRET_2024',
    department: 'Operations'
  })
});

const data = await response.json();
if (response.ok) {
  localStorage.setItem('cfis_token', data.token);
  window.location.href = '/admin/dashboard';
}
```

## Support & Documentation

### File Structure
```
src/
  pages/admin/
    AdminRegister.jsx      ← Admin registration form
    AdminLogin.jsx         ← Admin login (updated)
  context/
    AuthContext.jsx        ← Auth logic (updated)
  routes/
    AppRoutes.jsx          ← Includes /admin/register route
  services/
    api.js                 ← API calls (updated)

Backend/
  controllers/
    auth.controller.js     ← Admin registration logic
  routes/
    auth.routes.js         ← /register-admin endpoint
  models/
    User.model.js          ← Admin fields support
```

### Related Documentation
- [User Authentication Guide](./AUTHENTICATION_GUIDE.md)
- [API Documentation](./API_DOCS.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial admin registration system |
| 1.0.1 | 2024 | Added department field support |
| 1.1.0 | 2024 | Enhanced security validation |

## Contact & Support

For issues or questions regarding admin registration:
1. Check troubleshooting section above
2. Review error messages in browser console
3. Check Backend server logs
4. Contact system administrator

---

**Last Updated:** 2024
**System Version:** v2.0 with Advanced Analytics & Real-time Predictions
