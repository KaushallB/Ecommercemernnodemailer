// Lab 6 Email Campaign Performance Analysis Script
// Run this in Node.js to calculate campaign metrics

const fs = require('fs');
const path = require('path');

// Function to parse CSV data
function parseCSV(csvData) {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] ? values[index].trim() : '';
    });
    return obj;
  });
}

// Function to calculate campaign metrics
function calculateCampaignMetrics() {
  try {
    // Read campaign results
    const campaignResultsPath = path.join(__dirname, '../../LAB_6_DATA/campaign_results.csv');
    const campaignData = fs.readFileSync(campaignResultsPath, 'utf8');
    const results = parseCSV(campaignData);
    
    // Read customer data for segmentation analysis
    const customersPath = path.join(__dirname, '../../LAB_6_DATA/customers.csv');
    const customerData = fs.readFileSync(customersPath, 'utf8');
    const customers = parseCSV(customerData);
    
    // Calculate overall metrics
    const totalSent = results.length;
    const totalOpened = results.filter(r => r.opened === '1').length;
    const totalClicked = results.filter(r => r.clicked === '1').length;
    const totalBounced = results.filter(r => r.bounced === '1').length;
    const totalUnsubscribed = results.filter(r => r.unsubscribed === '1').length;
    
    // Calculate rates
    const openRate = ((totalOpened / totalSent) * 100).toFixed(2);
    const clickThroughRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(2) : '0.00';
    const bounceRate = ((totalBounced / totalSent) * 100).toFixed(2);
    const unsubscribeRate = ((totalUnsubscribed / totalSent) * 100).toFixed(2);
    
    // Combine customer and campaign data for segment analysis
    const combinedData = results.map(result => {
      const customer = customers.find(c => c.email === result.email_id);
      return { ...result, ...customer };
    });
    
    // Segment analysis
    const highEngagement = combinedData.filter(d => 
      parseInt(d.engagement_score) >= 85 && parseInt(d.previous_purchases) >= 3
    );
    const lowEngagement = combinedData.filter(d => 
      parseInt(d.engagement_score) < 85 || parseInt(d.previous_purchases) < 3
    );
    
    // High engagement segment metrics
    const highEngagementOpened = highEngagement.filter(d => d.opened === '1').length;
    const highEngagementClicked = highEngagement.filter(d => d.clicked === '1').length;
    const highEngagementOpenRate = highEngagement.length > 0 ? 
      ((highEngagementOpened / highEngagement.length) * 100).toFixed(2) : '0.00';
    const highEngagementClickRate = highEngagementOpened > 0 ? 
      ((highEngagementClicked / highEngagementOpened) * 100).toFixed(2) : '0.00';
    
    // Low engagement segment metrics
    const lowEngagementOpened = lowEngagement.filter(d => d.opened === '1').length;
    const lowEngagementClicked = lowEngagement.filter(d => d.clicked === '1').length;
    const lowEngagementOpenRate = lowEngagement.length > 0 ? 
      ((lowEngagementOpened / lowEngagement.length) * 100).toFixed(2) : '0.00';
    const lowEngagementClickRate = lowEngagementOpened > 0 ? 
      ((lowEngagementClicked / lowEngagementOpened) * 100).toFixed(2) : '0.00';
    
    // Generate comprehensive report
    const report = {
      campaignOverview: {
        totalEmailsSent: totalSent,
        totalOpened: totalOpened,
        totalClicked: totalClicked,
        totalBounced: totalBounced,
        totalUnsubscribed: totalUnsubscribed
      },
      performanceMetrics: {
        openRate: `${openRate}%`,
        clickThroughRate: `${clickThroughRate}%`,
        bounceRate: `${bounceRate}%`,
        unsubscribeRate: `${unsubscribeRate}%`
      },
      segmentAnalysis: {
        highEngagementSegment: {
          totalRecipients: highEngagement.length,
          openRate: `${highEngagementOpenRate}%`,
          clickRate: `${highEngagementClickRate}%`,
          members: highEngagement.map(d => d.email_id)
        },
        lowEngagementSegment: {
          totalRecipients: lowEngagement.length,
          openRate: `${lowEngagementOpenRate}%`,
          clickRate: `${lowEngagementClickRate}%`,
          members: lowEngagement.map(d => d.email_id)
        }
      },
      detailedResults: combinedData.map(d => ({
        email: d.email_id,
        opened: d.opened === '1',
        clicked: d.clicked === '1',
        bounced: d.bounced === '1',
        unsubscribed: d.unsubscribed === '1',
        segment: (parseInt(d.engagement_score) >= 85 && parseInt(d.previous_purchases) >= 3) ? 'High-Engagement' : 'Low-Engagement',
        engagementScore: d.engagement_score,
        previousPurchases: d.previous_purchases
      }))
    };
    
    console.log('\n=== EMAIL CAMPAIGN PERFORMANCE ANALYSIS ===\n');
    console.log('OVERALL METRICS:');
    console.log(`📧 Total Emails Sent: ${report.campaignOverview.totalEmailsSent}`);
    console.log(`📖 Open Rate: ${report.performanceMetrics.openRate}`);
    console.log(`👆 Click-Through Rate: ${report.performanceMetrics.clickThroughRate}`);
    console.log(`⚠️  Bounce Rate: ${report.performanceMetrics.bounceRate}`);
    console.log(`❌ Unsubscribe Rate: ${report.performanceMetrics.unsubscribeRate}\n`);
    
    console.log('SEGMENT PERFORMANCE:');
    console.log(`High-Engagement Segment (${report.segmentAnalysis.highEngagementSegment.totalRecipients} recipients):`);
    console.log(`  📖 Open Rate: ${report.segmentAnalysis.highEngagementSegment.openRate}`);
    console.log(`  👆 Click Rate: ${report.segmentAnalysis.highEngagementSegment.clickRate}`);
    console.log(`Low-Engagement Segment (${report.segmentAnalysis.lowEngagementSegment.totalRecipients} recipients):`);
    console.log(`  📖 Open Rate: ${report.segmentAnalysis.lowEngagementSegment.openRate}`);
    console.log(`  👆 Click Rate: ${report.segmentAnalysis.lowEngagementSegment.clickRate}\n`);
    
    console.log('DETAILED RESULTS:');
    report.detailedResults.forEach(result => {
      console.log(`${result.email} (${result.segment}):`);
      console.log(`  Opened: ${result.opened ? '✓' : '✗'}, Clicked: ${result.clicked ? '✓' : '✗'}`);
    });
    
    return report;
    
  } catch (error) {
    console.error('Error calculating metrics:', error);
    return null;
  }
}

// Export for use in other modules
module.exports = { calculateCampaignMetrics };

// Run analysis if this file is executed directly
if (require.main === module) {
  calculateCampaignMetrics();
}
