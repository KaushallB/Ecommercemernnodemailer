// Enhanced Performance Metrics Table Generator for Lab 6
const { calculateCampaignMetrics } = require('./lab6-performance-analysis');

function generateFormattedMetricsTable() {
  console.log('\n' + '='.repeat(80));
  console.log('               LAB 6 EMAIL MARKETING CAMPAIGN METRICS');
  console.log('='.repeat(80));
  
  // Get the raw metrics
  const metrics = calculateCampaignMetrics();
  
  if (!metrics) {
    console.log(' Could not generate metrics table');
    return;
  }
  
  console.log('\n OVERALL CAMPAIGN PERFORMANCE TABLE:');
  console.log('┌─────────────────────────┬──────────┬─────────────┬──────────────┬──────────────┐');
  console.log('│ Metric                  │ Formula  │ Calculation │ Result       │ Industry Avg │');
  console.log('├─────────────────────────┼──────────┼─────────────┼──────────────┼──────────────┤');
  console.log(`│ Open Rate              │ O ÷ TS   │ ${metrics.campaignOverview.totalOpened} ÷ ${metrics.campaignOverview.totalEmailsSent}       │ ${metrics.performanceMetrics.openRate.padEnd(12)} │ 21.33%       │`);
  console.log(`│ Click-Through Rate      │ C ÷ O    │ ${metrics.campaignOverview.totalClicked} ÷ ${metrics.campaignOverview.totalOpened}       │ ${metrics.performanceMetrics.clickThroughRate.padEnd(12)} │ 2.62%        │`);
  console.log(`│ Bounce Rate            │ B ÷ TS   │ ${metrics.campaignOverview.totalBounced} ÷ ${metrics.campaignOverview.totalEmailsSent}       │ ${metrics.performanceMetrics.bounceRate.padEnd(12)} │ 0.58%        │`);
  console.log(`│ Unsubscribe Rate       │ U ÷ TS   │ ${metrics.campaignOverview.totalUnsubscribed} ÷ ${metrics.campaignOverview.totalEmailsSent}       │ ${metrics.performanceMetrics.unsubscribeRate.padEnd(12)} │ 0.17%        │`);
  console.log('└─────────────────────────┴──────────┴─────────────┴──────────────┴──────────────┘');
  console.log('Legend: O=Opened, TS=Total Sent, C=Clicked, B=Bounced, U=Unsubscribed\n');
  
  console.log(' DETAILED RECIPIENT ANALYSIS TABLE:');
  console.log('┌─────────────────────────┬────────┬─────────┬─────────┬──────────┬──────────────┐');
  console.log('│ Recipient               │ Opened │ Clicked │ Bounced │ Unsub    │ Segment      │');
  console.log('├─────────────────────────┼────────┼─────────┼─────────┼──────────┼──────────────┤');
  
  metrics.detailedResults.forEach(result => {
    const email = result.email.padEnd(23);
    const opened = result.opened ? '   ✓' : '   ✗';
    const clicked = result.clicked ? '    ✓' : '    ✗';
    const bounced = result.bounced ? '    ✓' : '    ✗';
    const unsubscribed = result.unsubscribed ? '    ✓' : '    ✗';
    const segment = result.segment.slice(0, 12).padEnd(12);
    
    console.log(`│ ${email} │${opened}    │${clicked}    │${bounced}    │${unsubscribed}     │ ${segment} │`);
  });
  
  console.log('└─────────────────────────┴────────┴─────────┴─────────┴──────────┴──────────────┘\n');
  
  console.log(' SEGMENT COMPARISON TABLE:');
  console.log('┌─────────────────────────┬────────────────┬────────────────┬──────────────────┐');
  console.log('│ Segment                 │ Recipients     │ Open Rate      │ Click Rate       │');
  console.log('├─────────────────────────┼────────────────┼────────────────┼──────────────────┤');
  console.log(`│ High-Engagement         │ ${metrics.segmentAnalysis.highEngagementSegment.totalRecipients.toString().padEnd(14)} │ ${metrics.segmentAnalysis.highEngagementSegment.openRate.padEnd(14)} │ ${metrics.segmentAnalysis.highEngagementSegment.clickRate.padEnd(16)} │`);
  console.log(`│ Low-Engagement          │ ${metrics.segmentAnalysis.lowEngagementSegment.totalRecipients.toString().padEnd(14)} │ ${metrics.segmentAnalysis.lowEngagementSegment.openRate.padEnd(14)} │ ${metrics.segmentAnalysis.lowEngagementSegment.clickRate.padEnd(16)} │`);
  console.log('└─────────────────────────┴────────────────┴────────────────┴──────────────────┘\n');
  
  console.log(' PERFORMANCE INSIGHTS:');
  console.log(' STRENGTHS:');
  console.log('   • Open rate (75%) is 3.5x above industry average');
  console.log('   • Click-through rate (66.67%) is 25x above industry average');
  console.log('   • Zero bounce rate indicates excellent email delivery');
  console.log('   • Zero unsubscribe rate shows highly relevant content');
  
  console.log('\n AREAS FOR IMPROVEMENT:');
  console.log('   • One high-engagement user did not open the email');
  console.log('   • Consider A/B testing different subject lines');
  console.log('   • Implement personalization beyond segmentation');
  
  console.log('\n' + '='.repeat(80));
  console.log('               END OF PERFORMANCE ANALYSIS');
  console.log('='.repeat(80) + '\n');
}

// Run the enhanced table generator
generateFormattedMetricsTable();
