import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Layout } from '@/components/Layout';
import { playerService, emailService } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  Clock, 
  Mail, 
  Eye, 
  EyeOff, 
  Users, 
  Settings, 
  CheckCircle2,
  FileText,
  Globe,
  MessageSquare
} from 'lucide-react';

export default function PlayerStatus() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reportStatus, setReportStatus] = useState<'pending' | 'ready'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [sharingEnabled, setSharingEnabled] = useState<boolean | null>(null);
  const [showSimulateButton, setShowSimulateButton] = useState(true);
  
  // Career interest form
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [careerForm, setCareerForm] = useState({
    preferredRegions: [] as string[],
    teamsOfInterest: '',
    availability: '',
    contactMethod: 'email'
  });

  useEffect(() => {
    checkReportStatus();
    loadSharingPreference();
  }, []);

  const checkReportStatus = async () => {
    if (!user) return;
    
    try {
      const result = await playerService.getReportStatus(user.id);
      setReportStatus(result.status);
    } catch (error) {
      console.error('Failed to check report status:', error);
    }
  };

  const loadSharingPreference = () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`sharing_${user.id}`);
    setSharingEnabled(saved ? saved === 'true' : true); // Default to true
  };

  const handleSharingChange = async (enabled: boolean) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await playerService.saveSharingPreference(user.id, enabled);
      setSharingEnabled(enabled);
      toast({
        title: "Sharing preference saved",
        description: enabled 
          ? "Your report will be visible to scouts" 
          : "Your report will remain private",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preference",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateReportReady = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await playerService.generateReport(user.id);
      await emailService.sendEmail(
        user.email,
        "Your Player Report Is Ready",
        `Hi ${user.username},\n\nYour TalentScope performance report has been completed and is ready for review. You can view it at any time in your dashboard.\n\nBest regards,\nThe TalentScope Team`
      );
      
      setReportStatus('ready');
      setShowSimulateButton(false);
      toast({
        title: "Report ready!",
        description: "Your performance analysis is complete. Check your email for details.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCareerInterest = async () => {
    if (!user) return;
    
    const requiredFields = ['preferredRegions', 'availability'];
    const missing = requiredFields.filter(field => {
      const value = careerForm[field as keyof typeof careerForm];
      return Array.isArray(value) ? value.length === 0 : !value;
    });

    if (missing.length > 0) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await playerService.requestScoutConnection(user.id, careerForm);
      toast({
        title: "Connection request submitted",
        description: "Scouts in your preferred regions will be notified of your interest.",
      });
      setShowCareerForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit connection request",
        variant: "destructive",
      });
    }
  };

  const regions = [
    'North America',
    'Europe', 
    'Asia',
    'South America',
    'Oceania'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Report Status</h1>
              <p className="text-xl text-muted-foreground">
                Track your performance analysis and manage your profile visibility
              </p>
            </div>

            {/* Report Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Analysis Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reportStatus === 'pending' ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Processing your data...</span>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                      <Progress value={65} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        Your report is being generated. ETA: up to 7 days. We'll email{' '}
                        <span className="font-medium">{user?.email}</span> when it's ready.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                      <Mail className="h-5 w-5 text-electric" />
                      <span className="text-sm">
                        We're crunching your matches and trends—this takes up to 7 days.
                      </span>
                    </div>

                    {/* Simulate Button for Demo */}
                    {showSimulateButton && (
                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-3">
                          For demo purposes - simulate report completion:
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={simulateReportReady}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Generating...' : 'Simulate report ready'}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Your report is ready!</h3>
                        <p className="text-sm text-muted-foreground">
                          We've emailed it to {user?.email}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => navigate('/player/report')}
                      variant="hero"
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sharing Preferences */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {sharingEnabled ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  Share your report with scouts?
                </CardTitle>
                <CardDescription>
                  Sharing lets scouts discover you in our database. You can change this anytime.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="share-yes"
                      checked={sharingEnabled === true}
                      onCheckedChange={() => handleSharingChange(true)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="share-yes" className="font-medium">
                      Yes — Add my report to the scout database (recommended)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="share-no"
                      checked={sharingEnabled === false}
                      onCheckedChange={() => handleSharingChange(false)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="share-no" className="font-medium">
                      No — Keep my report private for personal use
                    </Label>
                  </div>
                </div>

                {sharingEnabled && (
                  <div className="p-4 bg-electric/5 border border-electric/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-electric" />
                      <span className="text-sm font-medium text-electric">Discoverable by scouts</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your anonymized performance data and contact preferences will be visible to verified scouts and team managers.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Career Interest */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Career Opportunities
                </CardTitle>
                <CardDescription>
                  Let scouts know you're interested in new opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={showCareerForm} onOpenChange={setShowCareerForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Connect me with scouts
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Career Interest Form</DialogTitle>
                      <DialogDescription>
                        Tell us about your career preferences so we can connect you with the right opportunities.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Preferred regions *</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {regions.map(region => (
                            <div key={region} className="flex items-center space-x-2">
                              <Checkbox
                                id={`region-${region}`}
                                checked={careerForm.preferredRegions.includes(region)}
                                onCheckedChange={(checked) => {
                                  setCareerForm(prev => ({
                                    ...prev,
                                    preferredRegions: checked
                                      ? [...prev.preferredRegions, region]
                                      : prev.preferredRegions.filter(r => r !== region)
                                  }));
                                }}
                              />
                              <Label htmlFor={`region-${region}`} className="text-sm">
                                {region}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="teams" className="text-sm font-medium">Teams of interest</Label>
                        <Textarea
                          id="teams"
                          placeholder="List specific teams or organizations you'd like to hear from..."
                          value={careerForm.teamsOfInterest}
                          onChange={(e) => setCareerForm(prev => ({ ...prev, teamsOfInterest: e.target.value }))}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availability" className="text-sm font-medium">Availability window *</Label>
                        <Input
                          id="availability"
                          placeholder="e.g., Immediately, 3-6 months, After current season..."
                          value={careerForm.availability}
                          onChange={(e) => setCareerForm(prev => ({ ...prev, availability: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Contact method</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="email-contact"
                            checked={careerForm.contactMethod === 'email'}
                            onCheckedChange={() => setCareerForm(prev => ({ ...prev, contactMethod: 'email' }))}
                          />
                          <Label htmlFor="email-contact" className="text-sm">
                            Email ({user?.email})
                          </Label>
                        </div>
                      </div>

                      <Button 
                        onClick={handleCareerInterest}
                        className="w-full"
                        disabled={careerForm.preferredRegions.length === 0 || !careerForm.availability}
                      >
                        Submit Interest
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Settings Link */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Account Settings</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage your profile and privacy settings
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/settings')}
                  >
                    Manage
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