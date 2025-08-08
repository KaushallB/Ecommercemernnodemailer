const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Create transporter for lab email campaign
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: process.env.SMTP_PORT || 1025,
  secure: false,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : null,
});

// Function to send marketing campaign email
const sendMarketingCampaignEmail = async (recipientEmail, customerData) => {
  try {
    // Read the HTML template
    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../../LAB_6_DATA/email_template.html"), 
      "utf8"
    );

    // Personalize the email based on customer segment
    let personalizedSubject;
    if (customerData.engagement_score >= 85 && customerData.previous_purchases >= 3) {
      personalizedSubject = "🌱 VIP Green Friday: Exclusive 30% Off + Early Access!";
    } else {
      personalizedSubject = "🌱 Green Friday Sale: 30% Off Eco-Products + Free Shipping!";
    }

    const mailOptions = {
      from: `EcoCart Marketing <marketing@ecocart.com>`,
      to: recipientEmail,
      subject: personalizedSubject,
      html: htmlTemplate,
      text: `
        Green Friday Sale - EcoCart
        
        Hey there, eco-warrior!
        
        Our biggest sale of the year is here! Get 30% OFF all eco-friendly products.
        
        Featured Products:
        - Reusable Water Bottles: Rs 560 (was Rs 800)
        - Organic Cotton T-Shirts: Rs 840 (was Rs 1,200) 
        - Plant-Based Skincare Set: Rs 1,400 (was Rs 2,000)
        
        Shop now: http://localhost:5173/shop/listing
        
        FREE shipping on orders over Rs 1,500!
        
        Limited time offer - ends this weekend!
        
        Best regards,
        EcoCart Team
        
        Unsubscribe: [link]
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Campaign email sent successfully to ${recipientEmail}:`, result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      recipient: recipientEmail,
    };
  } catch (error) {
    console.error(`Error sending campaign email to ${recipientEmail}:`, error);
    return {
      success: false,
      error: error.message,
      recipient: recipientEmail,
    };
  }
};

// Function to send campaign to all customers
const sendCampaignToAllCustomers = async () => {
  const customers = [
    { email: "021bim002@sxc.edu.np", age: 22, gender: "Female", region: "Kathmandu", previous_purchases: 3, engagement_score: 85 },
    { email: "021bim013@sxc.edu.np", age: 22, gender: "Male", region: "Kathmandu", previous_purchases: 5, engagement_score: 92 },
    { email: "021bim017@sxc.edu.np", age: 22, gender: "Male", region: "Lalitpur", previous_purchases: 2, engagement_score: 78 },
    { email: "021bim061@sxc.edu.np", age: 23, gender: "Female", region: "Bhaktapur", previous_purchases: 4, engagement_score: 88 }
  ];

  const results = [];
  
  for (const customer of customers) {
    const result = await sendMarketingCampaignEmail(customer.email, customer);
    results.push(result);
    
    // Add delay between emails to avoid spam detection
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
};

module.exports = {
  sendMarketingCampaignEmail,
  sendCampaignToAllCustomers,
};
