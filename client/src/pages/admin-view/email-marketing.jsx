import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Mail,
  TrendingUp,
  Users,
  MousePointer,
  AlertTriangle,
  UserMinus,
  PlayCircle,
  BarChart3,
  RefreshCw
} from 'lucide-react';

function AdminEmailMarketing() {
  const [campaignMetrics, setCampaignMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const { toast } = useToast();

  // Fetch campaign metrics
  const fetchCampaignMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/email-marketing/metrics');
      if (response.ok) {
        const data = await response.json();
        setCampaignMetrics(data);
      } else {
        throw new Error('Failed to fetch metrics');
      }
    } catch (error) {
      console.error('Error fetching campaign metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load campaign metrics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send email campaign
  const sendEmailCampaign = async () => {
    try {
      setIsSendingCampaign(true);
      const response = await fetch('/api/admin/email-marketing/send-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Campaign Sent Successfully!",
          description: `Email sent to ${data.totalSent} recipients`,
        });
        // Refresh metrics after sending
        setTimeout(() => fetchCampaignMetrics(), 2000);
      } else {
        throw new Error('Failed to send campaign');
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast({
        title: "Campaign Failed",
        description: "Failed to send email campaign",
        variant: "destructive",
      });
    } finally {
      setIsSendingCampaign(false);
    }
  };

  useEffect(() => {
    fetchCampaignMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading campaign metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-600 flex items-center gap-2">
            <Mail className="w-8 h-8" />
            Email Marketing Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Lab 6 Email Campaign Performance & Management</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={fetchCampaignMetrics}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button
            onClick={sendEmailCampaign}
            disabled={isSendingCampaign}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {isSendingCampaign ? 'Sending...' : 'Send New Campaign'}
          </Button>
        </div>
      </div>

      {campaignMetrics ? (
        <>
          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Open Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {campaignMetrics.performanceMetrics.openRate}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {campaignMetrics.campaignOverview.totalOpened} of {campaignMetrics.campaignOverview.totalEmailsSent} opened
                </p>
                <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700">
                  3.5x Industry Avg
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Click-Through Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {campaignMetrics.performanceMetrics.clickThroughRate}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {campaignMetrics.campaignOverview.totalClicked} clicks from {campaignMetrics.campaignOverview.totalOpened} opens
                </p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                  25x Industry Avg
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bounce Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {campaignMetrics.performanceMetrics.bounceRate}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {campaignMetrics.campaignOverview.totalBounced} bounced emails
                </p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                  Excellent
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Unsubscribe Rate</CardTitle>
                <UserMinus className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {campaignMetrics.performanceMetrics.unsubscribeRate}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {campaignMetrics.campaignOverview.totalUnsubscribed} unsubscribed
                </p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                  Perfect
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Detailed Campaign Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">Recipient</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Opened</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Clicked</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Bounced</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Unsubscribed</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Segment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignMetrics.detailedResults.map((result, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">{result.email}</td>
                        <td className="p-3 text-center">
                          {result.opened ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">✓</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">✗</Badge>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {result.clicked ? (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">✓</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">✗</Badge>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {result.bounced ? (
                            <Badge variant="destructive">✓</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">✗</Badge>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {result.unsubscribed ? (
                            <Badge variant="destructive">✓</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">✗</Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="border-green-300 text-green-700">
                            {result.segment}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Segment Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">High-Engagement Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipients:</span>
                    <span className="font-semibold">{campaignMetrics.segmentAnalysis.highEngagementSegment.totalRecipients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Open Rate:</span>
                    <span className="font-semibold text-blue-600">{campaignMetrics.segmentAnalysis.highEngagementSegment.openRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Click Rate:</span>
                    <span className="font-semibold text-green-600">{campaignMetrics.segmentAnalysis.highEngagementSegment.clickRate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Low-Engagement Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipients:</span>
                    <span className="font-semibold">{campaignMetrics.segmentAnalysis.lowEngagementSegment.totalRecipients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Open Rate:</span>
                    <span className="font-semibold text-blue-600">{campaignMetrics.segmentAnalysis.lowEngagementSegment.openRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Click Rate:</span>
                    <span className="font-semibold text-green-600">{campaignMetrics.segmentAnalysis.lowEngagementSegment.clickRate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Campaign Data Available</h3>
            <p className="text-gray-500 mb-4">Send your first email campaign to see performance metrics</p>
            <Button
              onClick={sendEmailCampaign}
              disabled={isSendingCampaign}
              className="bg-green-600 hover:bg-green-700"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              {isSendingCampaign ? 'Sending...' : 'Send First Campaign'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdminEmailMarketing;
