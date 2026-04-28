# Frontend-Backend Integration Guide

## Overview

The Campus Food Intelligence System frontend has been fully integrated with the backend API. All localStorage dependencies have been removed and replaced with proper API calls.

## Key Changes Made

### 1. **API Service Layer** (`src/services/api.js`)
- Centralized API communication
- JWT token management
- Automatic token injection in headers
- Error handling

### 2. **Context Updates**

#### AuthContext (`src/context/AuthContext.jsx`)
- ✅ Uses `api.login()` instead of localStorage  
- ✅ Uses `api.register()` for registration
- ✅ Uses `api.getMe()` to fetch user data
- ✅ JWT token stored in localStorage: `cfis_token`
- ✅ Async authentication with loading states
- ✅ Error handling with error messages

#### BookingContext (`src/context/BookingContext.jsx`)
- ✅ Uses `api.getMyBookings()` / `api.getAllBookings()`
- ✅ Uses `api.createBooking()` for new bookings
- ✅ Uses `api.cancelBooking()` for cancellations
- ✅ Uses `api.markAsAttended()` / `api.markAsMissed()` (Admin)
- ✅ Auto-fetches bookings on authentication
- ✅ Loading states and error handling

#### MenuContext (`src/context/MenuContext.jsx`)
- ✅ Uses `api.getAllMenus()` to fetch menus
- ✅ Uses `api.createMenu()` for admin menu creation
- ✅ Uses `api.updateMenu()` for menu updates
- ✅ Uses `api.deleteMenu()` for menu deletion
- ✅ Loading states and error handling

### 3. **Page Updates**

#### Admin Pages
- **AdminDashboard**: Uses `api.getOverviewStats()` and `api.getAnalytics()`
- **AnalyticsDashboard**: Uses `api.getAnalytics()`, `api.getSustainabilityMetrics()`, `api.getMealPopularity()`
- **PredictionDashboard**: Uses `api.getPredictions()`
- **StudentManagement**: Uses `api.getAllStudents()`
- **MenuManagement**: Uses MenuContext with API integration

#### Student Pages
- **Login**: Async authentication with proper error handling
- **Register**: Async registration with validation
- **Dashboard**: Uses API data structure (`_id`, nested objects)
- **BookMeal**: Uses `menuId` for booking, handles async operations
- **BookingHistory**: Filters and displays API bookings
- **Profile**: Uses `api.updateProfile()` for updates

### 4. **Component Updates**
- **ProtectedRoute**: Handles loading state to prevent redirect flickering
- **LoadingSpinner**: Used across pages during API calls

### 5. **Data Structure Changes**

#### Before (Mock Data):
```javascript
{
  id: 1,
  studentId: 1,
  studentName: "John Doe",
  menuItems: ["Item 1", "Item 2"]
}
```

#### After (API Response):
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  student: {
    _id: "507f191e810c19729de860ea",
    name: "John Doe",
    email: "john@campus.com"
  },
  menu: {
    _id: "507f191e810c19729de860eb",
    items: ["Item 1", "Item 2"],
    timing: "12:00 PM - 2:00 PM"
  }
}
```

## Environment Configuration

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-food-db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Authentication Flow

1. User submits login credentials
2. Frontend calls `api.login(email, password)`
3. Backend validates credentials and returns JWT token
4. Token stored in localStorage as `cfis_token`
5. All subsequent API calls include token in `Authorization: Bearer <token>` header
6. Backend validates token on each protected endpoint
7. On logout, token is removed from localStorage

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Student registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Users (Admin)
- `GET /api/users/students` - Get all students
- `GET /api/users/students/:id` - Get student by ID
- `PUT /api/users/students/:id` - Update student
- `DELETE /api/users/students/:id` - Delete student

### Menus
- `GET /api/menus` - Get all menus (with filters)
- `GET /api/menus/date/:date` - Get menus by date
- `POST /api/menus` - Create menu (Admin)
- `PUT /api/menus/:id` - Update menu (Admin)
- `DELETE /api/menus/:id` - Delete menu (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/attend` - Mark attended (Admin)
- `PUT /api/bookings/:id/miss` - Mark missed (Admin)

### Analytics (Admin)
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/meal-popularity` - Meal popularity
- `GET /api/analytics/sustainability` - Sustainability metrics
- `GET /api/analytics/overview` - Overview stats

### Predictions (Admin)
- `GET /api/predictions` - Get demand predictions

## Common Issues & Solutions

### Issue 1: Token Expired
**Symptom**: User gets logged out suddenly
**Solution**: JWT tokens expire after 7 days (configurable). User needs to login again.

### Issue 2: CORS Errors
**Symptom**: API calls fail with CORS error
**Solution**: Ensure `CLIENT_URL` in backend `.env` matches frontend URL

### Issue 3: Data Not Loading
**Symptom**: Pages show loading spinner indefinitely
**Solution**: Check browser console for errors. Ensure backend is running and database is seeded.

### Issue 4: 401 Unauthorized
**Symptom**: API calls return 401 errors
**Solution**: Check if JWT token is valid. Try logging out and back in.

### Issue 5: Menu Items Not Showing in Bookings
**Symptom**: Booking shows but menu items are empty
**Solution**: Ensure menu is created for that date through Menu Management (Admin)

## Testing the Integration

### 1. Start Backend
```bash
cd Backend
npm install
npm run seed
npm run dev
```

### 2. Start Frontend
```bash
npm install
npm run dev
```

### 3. Test Login
- Student: `student@campus.com` / `student123`
- Admin: `admin@campus.com` / `admin123`

### 4. Test Features
- ✅ Login/Logout
- ✅ Student Registration
- ✅ Book a meal
- ✅ View booking history
- ✅ Update profile
- ✅ Admin: View analytics
- ✅ Admin: Manage students
- ✅ Admin: Manage menus
- ✅ Admin: View predictions

## Development Workflow

### Making Changes to API

1. Update backend controller/route
2. Update `src/services/api.js` if new endpoint
3. Update context provider if needed
4. Update components to use new data structure
5. Test thoroughly

### Adding New Features

1. Create backend endpoint
2. Add API method in `api.js`
3. Update/create context if needed
4. Create/update UI components
5. Handle loading and error states

## Security Considerations

✅ **Password Hashing**: bcrypt on backend
✅ **JWT Authentication**: Secure token-based auth
✅ **Protected Routes**: Middleware validation
✅ **CORS**: Configured for specific origin
✅ **Input Validation**: Express validator on backend
✅ **No Sensitive Data**: Passwords never sent to frontend

## Performance Optimization

- **Lazy Loading**: Routes can be lazy loaded
- **Caching**: Can implement React Query for caching
- **Pagination**: Can add to API endpoints if needed
- **Debouncing**: Can add to search inputs

## Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Push notifications
- [ ] Advanced filtering and sorting
- [ ] Export to PDF/Excel
- [ ] Mobile responsive optimization
- [ ] PWA features
- [ ] Image uploads for menu items
- [ ] QR code for meal verification

## Monitoring & Logging

### Frontend
- Browser DevTools Console
- Network tab for API calls
- React DevTools for state

### Backend
- Server logs (console)
- MongoDB logs
- API request logs (morgan)

## Deployment Checklist

- [ ] Update environment variables
- [ ] Change JWT_SECRET to production value
- [ ] Use HTTPS in production
- [ ] Set proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure database backups
- [ ] Test all features in production

---

**Integration Status: ✅ Complete**

All features are now fully integrated with the backend API. No localStorage persistence for critical data. Proper authentication and authorization in place.
