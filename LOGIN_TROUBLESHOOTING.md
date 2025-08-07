# Login Troubleshooting Guide

## Two Different Login Systems

### 1. EcoCart Application Login (Your App)
**URL**: http://localhost:5173/auth/login

**How it works:**
- Uses email OR phone number as identifier
- Your own user accounts that you create
- Stores users in your MongoDB database

**To test your app login:**
1. **Register a new account first:**
   - Go to http://localhost:5173/auth/register
   - Fill in: Username, Email, Phone, Password
   - Click Register

2. **Then login with:**
   - **Identifier**: Your email OR phone number
   - **Password**: The password you set during registration

**Example:**
```
Register with:
- Username: John Doe
- Email: john@example.com
- Phone: 9841234567
- Password: mypassword123

Login with:
- Identifier: john@example.com (or 9841234567)
- Password: mypassword123
```

### 2. eSewa Payment Gateway Login (External)
**URL**: eSewa's payment page (redirected from checkout)

**How it works:**
- External eSewa system
- Uses predefined test accounts only
- Cannot create custom accounts in test environment

**Correct test credentials:**
```
eSewa ID: 9806800001
Password: Nepal@123
MPIN: 1234

OR

Mobile: 9806800001
MPIN: 1234
```

## Common Issues & Solutions

### Issue 1: "Invalid username or Password/MPIN" on eSewa
**Cause**: Using wrong test credentials
**Solution**: Use the exact credentials provided above (9806800001, Nepal@123, 1234)

### Issue 2: Cannot login to your EcoCart app
**Cause**: No account exists yet
**Solution**: 
1. First register at http://localhost:5173/auth/register
2. Then login with your registered credentials

### Issue 3: "User not registered" error
**Cause**: Trying to login before registering
**Solution**: Go to register page first and create an account

### Issue 4: Database connection issues
**Check if:**
- MongoDB is running
- Backend server is running on port 5000
- Frontend is running on port 5173

## Quick Test Steps

### Test Your App Login:
1. **Register**: http://localhost:5173/auth/register
   ```
   Username: testuser
   Email: test@example.com
   Phone: 9841234567
   Password: test123
   ```

2. **Login**: http://localhost:5173/auth/login
   ```
   Identifier: test@example.com
   Password: test123
   ```

### Test eSewa Payment:
1. Add items to cart
2. Go to checkout
3. Select eSewa payment
4. Use eSewa test credentials: 9806800001 / Nepal@123 / 1234

## Admin Account Setup

To test admin features:
1. Register normally
2. Manually update user role in database:
   ```javascript
   // In MongoDB, update the user:
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

3. Login and access admin panel at http://localhost:5173/admin

## Debugging Commands

Check if servers are running:
```bash
# Check backend
curl http://localhost:5000/api/auth/check-auth

# Check if MongoDB is connected
# Look for "MongoDB connected" in server logs
```

Check browser console for errors:
- Open F12 Developer Tools
- Look for error messages in Console tab
- Check Network tab for failed requests
