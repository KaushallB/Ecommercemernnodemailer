const express = require('express');
const { sendCampaignToAllCustomers } = require('../../helpers/lab6-email-campaign');
const { calculateCampaignMetrics } = require('../../helpers/lab6-performance-analysis');

const router = express.Router();

// Route to send marketing campaign emails
router.post('/send-campaign', async (req, res) => {
  try {
    console.log('Starting email marketing campaign...');
    const results = await sendCampaignToAllCustomers();
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    res.status(200).json({
      success: true,
      message: `Campaign sent successfully to ${successCount} recipients`,
      details: {
        totalSent: results.length,
        successful: successCount,
        failed: failureCount,
        results: results
      }
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send campaign',
      error: error.message
    });
  }
});

// Route to analyze campaign performance
router.get('/analyze-performance', (req, res) => {
  try {
    const metrics = calculateCampaignMetrics();
    
    if (metrics) {
      res.status(200).json({
        success: true,
        message: 'Campaign analysis completed',
        data: metrics
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to analyze campaign data'
      });
    }
  } catch (error) {
    console.error('Error analyzing campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze campaign',
      error: error.message
    });
  }
});

module.exports = router;
