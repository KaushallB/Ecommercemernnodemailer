# eSewa Payment Testing Guide

## Overview
This guide will help you test eSewa payment integration in your EcoCart application using eSewa's test environment.

## Prerequisites
✅ You already have the test configuration set up:
- Merchant ID: `EPAYTEST`
- Secret Key: `8gBm/:&EnhH.1/q`
- Test URL: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`

## Step-by-Step Testing Process

### 1. Start Your Application
```bash
# Terminal 1: Start Backend Server
cd server
npm start

# Terminal 2: Start Frontend
cd client
npm run dev
```

### 2. Test eSewa Payment Flow

#### A. Place an Order
1. Open http://localhost:5173
2. Login/Register as a customer
3. Add eco-friendly products to cart
4. Go to checkout
5. Add/select delivery address
6. Choose "eSewa Digital Payment" option
7. Click "Checkout with eSewa"

#### B. eSewa Test Payment Page
You'll be redirected to eSewa's test payment page where you must use **specific test credentials**:

**Official eSewa Test Credentials (from eSewa documentation):**

**Method 1 - eSewa ID Login:**
- **eSewa ID**: `9806800001` (or 9806800002/3/4/5)
- **Password**: `Nepal@123`
- **MPIN**: `1122` (for applications)

**Method 2 - Mobile Login:**
- **Mobile Number**: `9806800001` (or 9806800002/3/4/5)
- **MPIN**: `1122`

**⚠️ Important Notes:**
- You CANNOT use random/custom credentials in eSewa test environment
- Only the predefined test accounts work
- These are official eSewa test credentials provided for developers
- If you get 401 errors, the eSewa test server might be temporarily down

**Alternative Test Methods:**
- Try different test IDs: 9806800002, 9806800003, 9806800004, 9806800005
- Make sure there are no extra spaces in the credentials
- Try using MPIN `1122` instead of `1234`

#### C. Complete Payment
1. Fill in the test credentials
2. Click "Pay Now"
3. You'll be redirected back to your application
4. Payment verification will happen automatically

### 3. Test Different Scenarios

#### Success Flow:
1. Use valid test credentials
2. Complete payment
3. Verify redirection to success page
4. Check order status in admin panel
5. Check email notifications (Mailpit)

#### Failure Flow:
1. Close the eSewa window without payment
2. Verify redirection to failure page
3. Check that order remains unpaid

### 4. Verify Email Notifications

#### Check Mailpit (Email Testing)
1. Open http://localhost:8025 (Mailpit web interface)
2. Look for order confirmation emails
3. Check email content and formatting

### 5. Admin Testing

#### Order Management:
1. Login as admin (http://localhost:5173/auth/login)
2. Go to Orders section
3. View new orders
4. Update order status
5. Verify customer receives status update emails

#### Settings Management:
1. Go to Admin > Settings
2. Update delivery charges
3. Test different delivery charge scenarios

## Test Data Suggestions

### Sample Test Products:
- Organic Bananas (Rs 120)
- Bamboo Toothbrush (Rs 80)
- Eco-friendly Tote Bag (Rs 250)

### Sample Address:
```
Address: Thamel, Kathmandu
City: Kathmandu
Pincode: 44600
Phone: 9841234567
```

## Debugging Tips

### Common Issues:
1. **Payment not redirecting**: Check console for errors
2. **Email not sending**: Verify Mailpit is running on port 1025
3. **Order not updating**: Check backend logs for errors

### Console Logs to Check:
```javascript
// Frontend (Browser Console)
- Payment form submission
- eSewa redirection
- Return page parameters

// Backend (Terminal)
- Order creation logs
- eSewa payment data
- Email sending status
```

### Verify Payment Parameters:
When you return from eSewa, check the URL parameters:
```
http://localhost:5173/shop/esewa-return?oid=ORDER_ID&amt=AMOUNT&refId=ESEWA_REF_ID
```

## Test Checklist

- [ ] Order creation with eSewa payment
- [ ] Order creation with Cash on Delivery
- [ ] eSewa payment redirection
- [ ] Payment verification on return
- [ ] Order confirmation email
- [ ] Admin order status update
- [ ] Status update email to customer
- [ ] Delivery charge calculation
- [ ] Free delivery threshold
- [ ] Admin settings update

## Mailpit Setup (If not running)

If Mailpit is not installed:
```bash
# Install Mailpit
go install github.com/axllent/mailpit@latest

# OR download binary from GitHub releases
# https://github.com/axllent/mailpit/releases

# Run Mailpit
mailpit --smtp=1025 --listen=8025
```

## Production Considerations

When moving to production:
1. Change `ESEWA_MERCHANT_ID` to your actual merchant ID
2. Update `ESEWA_SECRET_KEY` to your production key
3. Change `ESEWA_URL` to production URL
4. Update success/failure URLs to production domains
5. Set up real SMTP service instead of Mailpit

## Support

If you encounter issues:
1. Check browser console for frontend errors
2. Check server terminal for backend errors
3. Verify all environment variables are set
4. Ensure Mailpit is running for email testing
5. Test with different browsers
