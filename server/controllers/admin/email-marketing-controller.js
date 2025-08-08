const { calculateCampaignMetrics } = require('../../helpers/lab6-performance-analysis');
const { sendCampaignToAllCustomers } = require('../../helpers/lab6-email-campaign');

const getEmailMarketingMetrics = async (req, res) => {
  try {
    // Get campaign metrics
    const metrics = calculateCampaignMetrics();
    
    if (!metrics) {
      return res.status(404).json({
        success: false,
        message: "No campaign data found. Please send a campaign first.",
      });
    }

    res.status(200).json({
      success: true,
      data: metrics,
      ...metrics, // Spread the metrics to maintain the same structure as expected by frontend
    });
  } catch (error) {
    console.error("Error fetching email marketing metrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign metrics",
      error: error.message,
    });
  }
};

const sendEmailCampaign = async (req, res) => {
  try {
    console.log(' Admin triggered email campaign...');
    
    // Send campaign emails
    const results = await sendCampaignToAllCustomers();
    
    // Count successful sends
    const successfulSends = results.filter(result => result.success).length;
    const failedSends = results.filter(result => !result.success).length;
    
    console.log(`Campaign completed: ${successfulSends} sent, ${failedSends} failed`);
    
    res.status(200).json({
      success: true,
      message: "Email campaign sent successfully",
      totalSent: successfulSends,
      totalFailed: failedSends,
      results: results,
    });
  } catch (error) {
    console.error("Error sending email campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email campaign",
      error: error.message,
    });
  }
};

module.exports = {
  getEmailMarketingMetrics,
  sendEmailCampaign,
};
