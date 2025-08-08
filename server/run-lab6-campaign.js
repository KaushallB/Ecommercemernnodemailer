// Simple test script to send Lab 6 campaign emails
const { sendCampaignToAllCustomers } = require('./helpers/lab6-email-campaign');
const { calculateCampaignMetrics } = require('./helpers/lab6-performance-analysis');

async function runLab6Campaign() {
  console.log('🚀 Starting Lab 6 Email Marketing Campaign...\n');
  
  try {
    // Send campaign emails
    console.log('📧 Sending emails to all students...');
    const results = await sendCampaignToAllCustomers();
    
    console.log('\n📊 Campaign Results:');
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ Email sent successfully to ${result.recipient}`);
      } else {
        console.log(`❌ Failed to send email to ${result.recipient}: ${result.error}`);
      }
    });
    
    // Calculate performance metrics
    console.log('\n📈 Analyzing Campaign Performance...');
    const metrics = calculateCampaignMetrics();
    
    console.log('\n🎉 Lab 6 Campaign Complete!');
    console.log('Check your email server at http://localhost:8025 to see the sent emails');
    
  } catch (error) {
    console.error('❌ Campaign failed:', error);
  }
}

// Run the campaign
runLab6Campaign();
