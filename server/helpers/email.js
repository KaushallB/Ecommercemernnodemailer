const nodemailer = require("nodemailer");

// Create transporter using SMTP configuration from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: process.env.SMTP_PORT || 1025,
  secure: false, // true for 465, false for other ports
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : null, // No auth for Mailpit
});

// Send email function
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `${process.env.FROM_NAME || "EcoCart"} <${process.env.FROM_EMAIL || "noreply@ecocart.com"}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send order confirmation email (only for confirmed orders)
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const subject = "EcoCart - Order Confirmation";
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb;">
      <!-- Header -->
      <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
        <img src="https://i.imgur.com/YKXdfbu.png" alt="EcoCart Logo" style="width: 60px; height: 60px; margin-bottom: 10px;" />
        <h1 style="margin: 0; font-size: 24px;">EcoCart</h1>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px;">
        <h2 style="color: #059669; margin-top: 0;">Order Confirmed</h2>
        
        <p style="color: #374151; margin-bottom: 20px;">
          Thank you for your order! Here are your order details:
        </p>
        
        <!-- Order Details -->
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Total Amount:</strong> Rs ${orderDetails.totalAmount}</p>
          <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod === 'esewa' ? 'eSewa' : 'Cash on Delivery'}</p>
          <p><strong>Status:</strong> ${orderDetails.orderStatus}</p>
          <p><strong>Date:</strong> ${orderDetails.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : 'N/A'}</p>
        </div>
        
        <!-- Delivery Address -->
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #059669;">Delivery Address</h3>
          <p>${orderDetails.addressInfo?.address}</p>
          <p>${orderDetails.addressInfo?.city} - ${orderDetails.addressInfo?.pincode}</p>
          <p>Phone: ${orderDetails.addressInfo?.phone}</p>
        </div>
        
        <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
          We'll update you when your order ships. Thank you for choosing EcoCart!
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
        <p style="margin: 0;">© 2025 EcoCart. All rights reserved.</p>
      </div>
    </div>
  `;

  const text = `
    EcoCart - Order Confirmation
    
    Order Confirmed!
    Thank you for your order. Here are your order details:
    
    Order ID: ${orderDetails.orderId}
    Total Amount: Rs ${orderDetails.totalAmount}
    Payment Method: ${orderDetails.paymentMethod === 'esewa' ? 'eSewa' : 'Cash on Delivery'}
    Status: ${orderDetails.orderStatus}
    Date: ${orderDetails.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : 'N/A'}
    
    Delivery Address:
    ${orderDetails.addressInfo?.address}
    ${orderDetails.addressInfo?.city} - ${orderDetails.addressInfo?.pincode}
    Phone: ${orderDetails.addressInfo?.phone}
    
    We'll update you when your order ships. Thank you for choosing EcoCart!
    
    - EcoCart Team
  `;

  return await sendEmail(userEmail, subject, text, html);
};

// Send order shipped email
const sendOrderShippedEmail = async (userEmail, orderDetails) => {
  const subject = "📦 EcoCart - Order Shipped";
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb;">
      <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
        <img src="https://i.imgur.com/YKXdfbu.png" alt="EcoCart Logo" style="width: 60px; height: 60px; margin-bottom: 10px;" />
        <h1 style="margin: 0; font-size: 24px;">EcoCart</h1>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #059669; margin-top: 0;">Order Shipped! 📦</h2>
        <p style="color: #374151;">Your order #${orderDetails.orderId} has been shipped and is on its way!</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tracking Number:</strong> ${orderDetails.trackingNumber || 'Will be updated soon'}</p>
          <p><strong>Estimated Delivery:</strong> 2-3 business days</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">Thank you for choosing EcoCart!</p>
      </div>
    </div>
  `;
  
  const text = `EcoCart - Order Shipped\n\nYour order #${orderDetails.orderId} has been shipped!\nTracking: ${orderDetails.trackingNumber || 'Will be updated soon'}\n\nThank you for choosing EcoCart!`;
  
  return await sendEmail(userEmail, subject, text, html);
};

// Send order delivered email
const sendOrderDeliveredEmail = async (userEmail, orderDetails) => {
  const subject = "✅ EcoCart - Order Delivered";
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb;">
      <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
        <img src="https://i.imgur.com/YKXdfbu.png" alt="EcoCart Logo" style="width: 60px; height: 60px; margin-bottom: 10px;" />
        <h1 style="margin: 0; font-size: 24px;">EcoCart</h1>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #059669; margin-top: 0;">Order Delivered! ✅</h2>
        <p style="color: #374151;">Your order #${orderDetails.orderId} has been successfully delivered!</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>We hope you love your eco-friendly products! Please consider leaving a review.</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">Thank you for choosing sustainable shopping with EcoCart!</p>
      </div>
    </div>
  `;
  
  const text = `EcoCart - Order Delivered\n\nYour order #${orderDetails.orderId} has been delivered!\n\nThank you for choosing EcoCart!`;
  
  return await sendEmail(userEmail, subject, text, html);
};

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
};
