const crypto = require('crypto');

// eSewa configuration
const esewaConfig = {
  merchant_id: process.env.ESEWA_MERCHANT_ID || "EPAYTEST", // Use EPAYTEST for testing
  secret_key: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q", // Test secret key
  success_url: process.env.ESEWA_SUCCESS_URL || "http://localhost:5173/shop/esewa-return",
  failure_url: process.env.ESEWA_FAILURE_URL || "http://localhost:5173/shop/esewa-cancel",
  esewa_url: process.env.ESEWA_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form", // Test URL
};

// Generate signature for eSewa
function generateSignature(message, secretKey) {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message);
  return hmac.digest('base64');
}

// Create eSewa payment
function createEsewaPayment(orderData) {
  const {
    totalAmount,
    productDeliveryCharge = 0,
    productServiceCharge = 0,
    productCode,
    successUrl = esewaConfig.success_url,
    failureUrl = esewaConfig.failure_url
  } = orderData;

  // Format amounts to 2 decimal places
  const taxAmount = 0; // You can calculate tax if needed
  const total = parseFloat(totalAmount).toFixed(2);
  const deliveryCharge = parseFloat(productDeliveryCharge).toFixed(2);
  const serviceCharge = parseFloat(productServiceCharge).toFixed(2);
  const tax = parseFloat(taxAmount).toFixed(2);

  // Create message for signature
  const message = `total_amount=${total},transaction_uuid=${productCode},product_code=${esewaConfig.merchant_id}`;
  const signature = generateSignature(message, esewaConfig.secret_key);

  const paymentData = {
    amount: total,
    tax_amount: tax,
    total_amount: total,
    transaction_uuid: productCode,
    product_code: esewaConfig.merchant_id,
    product_service_charge: serviceCharge,
    product_delivery_charge: deliveryCharge,
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signature,
  };

  return {
    paymentData,
    esewaUrl: esewaConfig.esewa_url,
  };
}

// Verify eSewa payment
function verifyEsewaPayment(data) {
  const { oid, amt, refId } = data;
  
  // In production, you should verify the payment with eSewa's verification API
  // For now, we'll do basic validation
  if (oid && amt && refId) {
    return {
      isValid: true,
      transactionId: refId,
      orderId: oid,
      amount: amt
    };
  }
  
  return {
    isValid: false,
    message: "Invalid payment data"
  };
}

module.exports = {
  esewaConfig,
  createEsewaPayment,
  verifyEsewaPayment,
  generateSignature
};
