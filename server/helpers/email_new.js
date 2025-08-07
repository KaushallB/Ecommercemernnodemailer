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

// Send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const subject = "🌱 EcoCart - Order Confirmation";
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
      <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🌱 EcoCart</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Sustainable Shopping Made Easy</p>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #059669; margin-top: 0;">Thank you for your eco-friendly order!</h2>
        
        <p>Dear Valued Customer,</p>
        
        <p>Your order has been successfully placed! Here are the details:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId || 'N/A'}</p>
          <p><strong>Total Amount:</strong> Rs ${orderDetails.totalAmount || 'N/A'}</p>
          <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod === 'esewa' ? 'eSewa Digital Payment' : 'Cash on Delivery'}</p>
          <p><strong>Order Status:</strong> ${orderDetails.orderStatus || 'Pending'}</p>
          <p><strong>Order Date:</strong> ${orderDetails.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : 'N/A'}</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Delivery Address</h3>
          <p>${orderDetails.addressInfo?.address || 'N/A'}</p>
          <p>${orderDetails.addressInfo?.city || 'N/A'} - ${orderDetails.addressInfo?.pincode || 'N/A'}</p>
          <p><strong>Phone:</strong> ${orderDetails.addressInfo?.phone || 'N/A'}</p>
          ${orderDetails.addressInfo?.notes ? `<p><strong>Notes:</strong> ${orderDetails.addressInfo.notes}</p>` : ''}
        </div>
        
        <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #065f46;">
            <strong>🌿 Environmental Impact:</strong> Thank you for choosing eco-friendly products! 
            Your purchase contributes to a more sustainable future.
          </p>
        </div>
        
        <p>We'll send you another email with tracking information once your order ships.</p>
        
        <p style="margin-bottom: 30px;">
          If you have any questions about your order, please don't hesitate to contact our customer support team.
        </p>
        
        <div style="text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <p style="margin: 0; color: #6b7280;">Thank you for supporting sustainable shopping!</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">- The EcoCart Team 🌱</p>
        </div>
      </div>
    </div>
  `;

  const text = `
    🌱 EcoCart - Order Confirmation
    
    Thank you for your eco-friendly order!
    
    Order Details:
    - Order ID: ${orderDetails.orderId || 'N/A'}
    - Total Amount: Rs ${orderDetails.totalAmount || 'N/A'}
    - Payment Method: ${orderDetails.paymentMethod === 'esewa' ? 'eSewa Digital Payment' : 'Cash on Delivery'}
    - Order Status: ${orderDetails.orderStatus || 'Pending'}
    - Order Date: ${orderDetails.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : 'N/A'}
    
    Delivery Address:
    ${orderDetails.addressInfo?.address || 'N/A'}
    ${orderDetails.addressInfo?.city || 'N/A'} - ${orderDetails.addressInfo?.pincode || 'N/A'}
    Phone: ${orderDetails.addressInfo?.phone || 'N/A'}
    ${orderDetails.addressInfo?.notes ? `Notes: ${orderDetails.addressInfo.notes}` : ''}
    
    Thank you for supporting sustainable shopping!
    - The EcoCart Team 🌱
  `;

  return await sendEmail(userEmail, subject, text, html);
};

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
};
