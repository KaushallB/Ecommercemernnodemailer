# eSewa Payment Gateway Integration Steps - MERN Ecommerce Project

## Overview
This document outlines the complete integration process for eSewa payment gateway in our MERN stack ecommerce application, allowing customers to make secure online payments through eSewa's payment system.

## 🏗️ Integration Architecture

### System Flow
1. **Customer initiates checkout** → Selects eSewa payment method
2. **Order creation** → Backend creates order with pending status
3. **Payment redirection** → User redirected to eSewa payment gateway
4. **Payment processing** → Customer completes payment on eSewa
5. **Callback handling** → eSewa returns to our application with payment status
6. **Order completion** → Backend verifies payment and updates order status

---

## 🔧 Backend Implementation

### 1. eSewa Service Helper (`server/helpers/esewa.js`)

**Purpose**: Handles eSewa payment creation, signature generation, and payment verification

**Key Functions**:
- `generateSignature()`: Creates HMAC-SHA256 signatures for secure communication
- `createEsewaPayment()`: Generates payment form data with required fields
- `verifyEsewaPayment()`: Validates payment response from eSewa

```javascript
// Configuration for eSewa integration
const esewaConfig = {
  merchant_id: process.env.ESEWA_MERCHANT_ID || "EPAYTEST", // Test merchant ID
  secret_key: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q", // Test secret key
  success_url: "http://localhost:5173/shop/esewa-return",
  failure_url: "http://localhost:5173/shop/esewa-cancel",
  esewa_url: "https://rc-epay.esewa.com.np/api/epay/main/v2/form", // Test URL
};

// Signature generation for secure payment
function generateSignature(message, secretKey) {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message);
  return hmac.digest('base64');
}
```

**Security Features**:
- HMAC-SHA256 signature verification
- Secure transaction UUID generation
- Amount validation and formatting
- Test environment configuration

### 2. Order Controller (`server/controllers/shop/order-controller.js`)

**Enhanced Order Creation**:
```javascript
const createOrder = async (req, res) => {
  // Create order with eSewa-specific fields
  const newlyCreatedOrder = new Order({
    userId,
    cartItems,
    addressInfo,
    paymentMethod: paymentMethod || "esewa",
    paymentStatus: "pending",
    totalAmount,
    // eSewa specific fields
    transactionUuid: null, // Will be set during payment
    esewaTransactionCode: null
  });
  
  await newlyCreatedOrder.save();
  
  // Generate eSewa payment data
  if (paymentMethod === "esewa") {
    const esewaData = createEsewaPayment({
      totalAmount,
      productCode: newlyCreatedOrder._id,
      productDeliveryCharge: 0,
      productServiceCharge: 0
    });
    
    return res.status(201).json({
      success: true,
      orderId: newlyCreatedOrder._id,
      esewaPaymentData: esewaData.paymentData,
      esewaUrl: esewaData.esewaUrl
    });
  }
};
```

**Payment Capture & Verification**:
```javascript
const capturePayment = async (req, res) => {
  const { oid, amt, refId, orderId } = req.body;
  
  // Verify payment with eSewa
  const verificationResult = verifyEsewaPayment({ oid, amt, refId });
  
  if (!verificationResult.isValid) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });
  }
  
  // Update order status
  let order = await Order.findById(orderId || oid);
  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  order.paymentId = refId;
  order.payerId = "esewa";
  
  // Update product stock
  for (let item of order.cartItems) {
    let product = await Product.findById(item.productId);
    product.totalStock -= item.quantity;
    await product.save();
  }
  
  // Clear cart
  await Cart.findByIdAndDelete(order.cartId);
  await order.save();
};
```

### 3. Order Model Extensions (`server/models/Order.js`)

**Enhanced Schema**:
```javascript
const orderSchema = new mongoose.Schema({
  // Existing fields...
  paymentMethod: {
    type: String,
    enum: ["esewa", "cod", "paypal"],
    default: "esewa"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending"
  },
  // eSewa specific fields
  transactionUuid: {
    type: String,
    default: null
  },
  esewaTransactionCode: {
    type: String,
    default: null
  }
});
```

### 4. API Routes (`server/routes/shop/order-routes.js`)

```javascript
const router = express.Router();

// Order management routes
router.post("/create", createOrder);           // Create order & initiate payment
router.post("/capture", capturePayment);      // Handle eSewa callback
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
```

---

## 🎨 Frontend Implementation

### 1. Checkout Component (`client/src/pages/shopping-view/checkout.jsx`)

**Payment Method Selection**:
```jsx
// Payment method state
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("esewa");

// Payment handling logic
function handleInitiatePayment() {
  if (selectedPaymentMethod === "cod") {
    handleCashOnDeliveryOrder();
  } else if (selectedPaymentMethod === "esewa") {
    handleEsewaPayment();
  }
}
```

**eSewa Payment Flow**:
```jsx
function handleEsewaPayment() {
  const orderData = {
    userId: user?.id,
    cartId: cartItems?._id,
    cartItems: cartItems.items.map((item) => ({
      productId: item?.productId,
      title: item?.title,
      image: item?.image,
      price: item?.salePrice > 0 ? item?.salePrice : item?.price,
      quantity: item?.quantity,
    })),
    addressInfo: {
      addressId: currentSelectedAddress?._id,
      address: currentSelectedAddress?.address,
      city: currentSelectedAddress?.city,
      pincode: currentSelectedAddress?.pincode,
      phone: currentSelectedAddress?.phone,
    },
    paymentMethod: "esewa",
    paymentStatus: "pending",
    totalAmount: finalTotalAmount,
    orderDate: new Date(),
  };

  // Create order and get eSewa payment data
  dispatch(createNewOrder(orderData)).then((data) => {
    if (data?.payload?.success) {
      setIsPaymemntStart(true);
      // eSewa redirection will be handled by useEffect
    }
  });
}
```

**Dynamic Form Submission to eSewa**:
```jsx
// Automatically redirect to eSewa when payment data is received
useEffect(() => {
  if (esewaPaymentData && esewaUrl) {
    // Create form dynamically
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = esewaUrl;
    
    // Add all payment fields as hidden inputs
    Object.keys(esewaPaymentData).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = esewaPaymentData[key];
      form.appendChild(input);
    });
    
    // Submit form to redirect to eSewa
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}, [esewaPaymentData, esewaUrl]);
```

### 2. eSewa Return Handler (`client/src/pages/shopping-view/esewa-return.jsx`)

**Payment Callback Processing**:
```jsx
function EsewaReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // Extract eSewa response parameters
  const oid = params.get("oid");     // Order ID
  const amt = params.get("amt");     // Amount
  const refId = params.get("refId"); // eSewa reference ID

  useEffect(() => {
    if (oid && amt && refId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      // Verify and capture payment
      dispatch(capturePayment({ oid, amt, refId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [oid, amt, refId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}
```

### 3. Redux Store Integration (`client/src/store/shop/order-slice/index.js`)

**Order Creation API**:
```javascript
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/create",
      orderData
    );
    return response.data;
  }
);
```

**Payment Capture API**:
```javascript
export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId, oid, amt, refId }) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/capture",
      { paymentId, payerId, orderId, oid, amt, refId }
    );
    return response.data;
  }
);
```

---

## 🔧 Environment Configuration

### Backend Environment Variables (`.env`)
```env
# eSewa Configuration
ESEWA_MERCHANT_ID=EPAYTEST                    # Test merchant ID
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q             # Test secret key
ESEWA_SUCCESS_URL=http://localhost:5173/shop/esewa-return
ESEWA_FAILURE_URL=http://localhost:5173/shop/esewa-cancel
ESEWA_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form

# Production URLs (when going live)
# ESEWA_URL=https://epay.esewa.com.np/api/epay/main/v2/form
# ESEWA_MERCHANT_ID=your_production_merchant_id
# ESEWA_SECRET_KEY=your_production_secret_key
```

---

## 🛣️ Routing Configuration

### Frontend Routes (`client/src/App.jsx`)
```jsx
// Protected payment routes
<Route
  path="/shop/esewa-return"
  element={
    <CheckAuth isAuthenticated={isAuthenticated} user={user}>
      <EsewaReturnPage />
    </CheckAuth>
  }
/>
<Route
  path="/shop/payment-success"
  element={
    <CheckAuth isAuthenticated={isAuthenticated} user={user}>
      <PaymentSuccessPage />
    </CheckAuth>
  }
/>
<Route
  path="/shop/esewa-cancel"
  element={
    <CheckAuth isAuthenticated={isAuthenticated} user={user}>
      <PaymentFailedPage />
    </CheckAuth>
  }
/>
```

---

## 🔒 Security Features

### 1. **HMAC Signature Verification**
- All payment requests signed with HMAC-SHA256
- Prevents tampering with payment amounts
- Ensures request authenticity

### 2. **Transaction Validation**
- Server-side verification of payment parameters
- Cross-reference with original order data
- Amount validation to prevent manipulation

### 3. **Secure Callback Handling**
- Payment status verified before order completion
- Stock updates only after successful verification
- Cart cleared only after confirmed payment

---

## 📱 User Experience Flow

### Step-by-Step Process:

1. **Cart to Checkout**
   - Customer adds items to cart
   - Clicks "Proceed to Checkout"
   - Selects delivery address

2. **Payment Method Selection**
   - Choose between eSewa and Cash on Delivery
   - Review order summary with delivery charges
   - Click "Proceed to Payment"

3. **eSewa Payment Gateway**
   - Automatic redirection to eSewa
   - Customer enters eSewa credentials
   - Completes payment on eSewa platform

4. **Payment Confirmation**
   - Return to application via callback URL
   - Payment verification and order confirmation
   - Email notification sent to customer
   - Redirect to success page

5. **Order Management**
   - Order status updated to "confirmed"
   - Inventory automatically updated
   - Customer cart cleared
   - Order tracking available

---

## 🧪 Testing Configuration

### Test Environment Setup:
- **Merchant ID**: `EPAYTEST`
- **Secret Key**: `8gBm/:&EnhH.1/q`
- **Gateway URL**: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
- **Test Amount**: Any amount for testing purposes

### Test Payment Process:
1. Use test credentials provided by eSewa
2. Complete payment flow in sandbox environment
3. Verify callback handling and order updates
4. Test both success and failure scenarios

---

## 🚀 Production Deployment

### Pre-deployment Checklist:
- [ ] Update merchant ID to production credentials
- [ ] Replace secret key with production key
- [ ] Change eSewa URL to production endpoint
- [ ] Configure production callback URLs
- [ ] Test payment flow in production environment
- [ ] Set up monitoring for payment failures
- [ ] Configure error logging and notifications

### Production URLs:
- **Gateway**: `https://epay.esewa.com.np/api/epay/main/v2/form`
- **Success URL**: `https://yourdomain.com/shop/esewa-return`
- **Failure URL**: `https://yourdomain.com/shop/esewa-cancel`

---

## 📊 Key Benefits Achieved

✅ **Seamless Integration**: Direct integration with eSewa's payment gateway
✅ **Secure Transactions**: HMAC-SHA256 signature verification
✅ **Automatic Stock Management**: Real-time inventory updates
✅ **Email Notifications**: Automated order confirmation emails
✅ **Mobile Responsive**: Works across all devices
✅ **Error Handling**: Comprehensive error management
✅ **Test Environment**: Full sandbox testing capabilities

---

## 📞 Support & Maintenance

For ongoing support and maintenance:
- Monitor payment success rates
- Handle failed payment scenarios
- Update eSewa integration as needed
- Maintain test environment for development
- Regular security audits of payment flow

---

*This integration provides a complete, secure, and user-friendly eSewa payment solution for the MERN ecommerce application, enabling customers to make payments through Nepal's leading digital wallet service.*
