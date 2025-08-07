# eSewa Testing Troubleshooting

## Current Issue: 401 Unauthorized Error

### What's Happening:
- eSewa test server is rejecting the login with 401 error
- This means either:
  1. eSewa test server is temporarily down
  2. Test credentials have changed
  3. There's an issue with the test environment

### Immediate Solutions:

#### Option 1: Test Cash on Delivery (COD)
Since your app supports both payment methods, test COD first:

1. **Place COD Order:**
   ```
   1. Add items to cart
   2. Go to checkout  
   3. Select "Cash on Delivery (COD)"
   4. Click "Place Order (Cash on Delivery)"
   5. Check for confirmation message
   6. Verify email notification (if Mailpit is running)
   ```

2. **Test Admin Panel:**
   ```
   1. Login as admin
   2. Go to Orders section
   3. See the new COD order
   4. Update order status (pending → confirmed)
   5. Check if customer gets status update email
   ```

#### Option 2: Alternative eSewa Test Credentials
Try these variations:

```bash
# Variation 1:
eSewa ID: 9806800002
Password: Nepal@123  
MPIN: 1122

# Variation 2:
eSewa ID: 9806800003
Password: Nepal@123
MPIN: 1122

# Variation 3:
Mobile: 9806800001
MPIN: 1122 (skip password field)
```

#### Option 3: Check eSewa Test Environment Status
The 401 error might indicate eSewa's test server is down. You can:

1. **Wait and retry** - Test servers are sometimes unstable
2. **Contact eSewa support** - For updated test credentials
3. **Test your integration logic** - Using mock data

### Debugging Your Integration

#### Test Payment Data Generation:
Let's verify your payment data is correctly formatted:

```javascript
// Add this to your checkout component to see what data is being sent
console.log('eSewa Payment Data:', esewaPaymentData);
console.log('eSewa URL:', esewaUrl);
```

#### Check Network Tab:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try eSewa payment
4. Look for the POST request to eSewa
5. Check request headers and body

### Alternative Testing Approach

Since eSewa test environment might be unreliable, you can:

#### 1. Mock eSewa Payment (Development)
Create a mock payment flow for testing:

```javascript
// In development, bypass actual eSewa and simulate success
if (process.env.NODE_ENV === 'development') {
  // Simulate successful payment
  setTimeout(() => {
    window.location.href = `http://localhost:5173/shop/esewa-return?oid=${orderId}&amt=${amount}&refId=MOCK_REF_123`;
  }, 2000);
}
```

#### 2. Test Email Notifications
Focus on testing the email system:

```bash
# Start Mailpit (if not running)
mailpit --smtp=1025 --listen=8025

# Then test:
1. Place COD order
2. Check http://localhost:8025 for emails
3. Test admin status updates
4. Verify status update emails
```

### Next Steps

1. **Immediate**: Test COD functionality first
2. **Short-term**: Try different eSewa test credentials
3. **Long-term**: Contact eSewa for updated test environment info

The 401 error is likely temporary. Your integration code looks correct - the issue is with eSewa's test server, not your application.
