const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Send email function
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
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
  const subject = "Order Confirmation - Your Order has been Placed!";
  const text = `Dear Customer,

Thank you for your order! Your order has been successfully placed.

Order ID: ${orderDetails.orderId}
Total Amount: $${orderDetails.totalAmount}
Order Date: ${orderDetails.orderDate}

We will notify you once your order is shipped.

Thank you for shopping with us!`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Dear Customer,</p>
      <p>Thank you for your order! Your order has been successfully placed.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Order Details:</h3>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
        <p><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
      </div>
      
      <p>We will notify you once your order is shipped.</p>
      <p>Thank you for shopping with us!</p>
    </div>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (userEmail, orderDetails, newStatus) => {
  const subject = `Order Update - Your Order is ${newStatus}`;
  const text = `Dear Customer,

Your order status has been updated.

Order ID: ${orderDetails.orderId}
New Status: ${newStatus}

Thank you for your patience!`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Status Update</h2>
      <p>Dear Customer,</p>
      <p>Your order status has been updated.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>New Status:</strong> <span style="color: #007bff; font-weight: bold;">${newStatus}</span></p>
      </div>
      
      <p>Thank you for your patience!</p>
    </div>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
