import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Layout } from '@/components/Layout';
import { playerService } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  Download, 
  TrendingUp, 
  Target, 
  Activity, 
  Star, 
  AlertTriangle,
  BarChart3,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';

interface Report {
  id: string;
  userId: string;
  overallRating: number;
  roleFit: string;
  strengths: string[];
  areasToImprove: string[];
  consistencyScore: number;
  recentForm: string;
  status: 'pending' | 'ready';
  createdAt: Date;
}

export default function PlayerReport() {
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sharingEnabled, setSharingEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    loadReport();
    loadSharingPreference();
  }, []);

  const loadReport = async () => {
    if (!user) return;
    
    try {
      const result = await playerService.getReport(user.id);
      if (result.success && result.report) {
        setReport(result.report);
      } else {
        toast({
          title: "Report not found",
          description: "Your report may still be processing",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSharingPreference = () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`sharing_${user.id}`);
    setSharingEnabled(saved ? saved === 'true' : true);
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download started",
      description: "Your report PDF is being prepared",
    });
    // TODO: Implement actual PDF generation
  };

  const toggleSharing = async () => {
    if (!user || sharingEnabled === null) return;
    
    const newValue = !sharingEnabled;
    try {
      await playerService.saveSharingPreference(user.id, newValue);
      setSharingEnabled(newValue);
      toast({
        title: "Sharing preference updated",
        description: newValue 
          ? "Your report is now visible to scouts" 
          : "Your report is now private",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preference",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!report) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Report not available</h3>
              <p className="text-muted-foreground">
                Your performance report is still being processed or could not be loaded.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFormColor = (form: string) => {
    switch (form.toLowerCase()) {
      case 'improving':
        return 'text-green-600';
      case 'stable':
        return 'text-blue-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-6xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">CS:GO Performance Report</h1>
                <p className="text-muted-foreground">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Sharing Status Banner */}
            <Card className={`border-2 ${sharingEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {sharingEnabled ? (
                      <Eye className="h-5 w-5 text-green-600" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-600" />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {sharingEnabled ? 'Visible to scouts' : 'Private report'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {sharingEnabled 
                          ? 'Your report is discoverable by verified scouts and team managers'
                          : 'Your report is private and only visible to you'
                        }
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleSharing}>
                    <Settings className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Overall Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-bold ${getRatingColor(report.overallRating)}`}>
                      {report.overallRating}/10
                    </span>
                    <Star className={`h-5 w-5 ${getRatingColor(report.overallRating)}`} />
                  </div>
                  <Progress value={report.overallRating * 10} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Best Role Fit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-electric" />
                    <span className="text-xl font-bold">{report.roleFit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on playstyle analysis</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Consistency Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span className="text-xl font-bold">{report.consistencyScore}%</span>
                  </div>
                  <Progress value={report.consistencyScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Recent Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-5 w-5 ${getFormColor(report.recentForm)}`} />
                    <span className={`text-xl font-bold ${getFormColor(report.recentForm)}`}>
                      {report.recentForm}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  CS:GO Performance Trends
                </CardTitle>
                <CardDescription>
                  Your CS:GO performance metrics over the last 3 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">CS:GO performance chart visualization</p>
                    <p className="text-sm text-muted-foreground">Coming soon in full implementation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths and Areas to Improve */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Star className="h-5 w-5" />
                    Key Strengths
                  </CardTitle>
                  <CardDescription>
                    What you excel at in your CS:GO gameplay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-600 rounded-full" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <Target className="h-5 w-5" />
                    Areas to Improve
                  </CardTitle>
                  <CardDescription>
                    Focus areas for skill development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.areasToImprove.map((area, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-orange-600 rounded-full" />
                        <span className="text-sm">{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Match Analysis Heatmap Placeholder */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>CS:GO Match Performance Heatmap</CardTitle>
                <CardDescription>
                  Visual breakdown of your CS:GO performance across different game situations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive CS:GO heatmap visualization</p>
                    <p className="text-sm text-muted-foreground">Full CS:GO match analysis coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Want to improve?</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with coaches and training resources based on your report insights.
                    </p>
                  </div>
                  <Button variant="outline">
                    Find Training
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}