import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { playerService } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, 
  Database, 
  TrendingUp, 
  CheckCircle,
  ExternalLink,
  Gamepad2,
  Monitor,
  Zap
} from 'lucide-react';

export default function PlayerConnect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const providers = [
    {
      id: 'steam',
      name: 'Steam',
      icon: Zap,
      description: 'Access CS:GO, CS2, and other Steam games',
      color: 'text-blue-600'
    },
    {
      id: 'faceit',
      name: 'FACEIT',
      icon: Shield,
      description: 'Detailed match history and statistics',
      color: 'text-orange-600'
    },
    {
      id: 'valorant',
      name: 'Valorant API',
      icon: Gamepad2,
      description: 'Riot Games official statistics',
      color: 'text-red-600'
    },
    {
      id: 'cs2stats',
      name: 'CS2 Stats',
      icon: Monitor,
      description: 'Professional match data and analytics',
      color: 'text-purple-600'
    }
  ];

  const handleProviderToggle = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleSubmit = async () => {
    if (selectedProviders.length === 0) {
      toast({
        title: "Select providers",
        description: "Please select at least one data provider to continue",
        variant: "destructive",
      });
      return;
    }

    if (!hasConsent) {
      toast({
        title: "Consent required",
        description: "Please authorize data access to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await playerService.authorizeGameData(selectedProviders, hasConsent);
      
      if (result.success) {
        toast({
          title: "Data received",
          description: "Your report will be ready in ~7 days.",
        });
        navigate('/player/status');
      } else {
        toast({
          title: "Authorization failed",
          description: result.error || "Unable to connect to data providers",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Connect your game data</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Grant read-only access so we can analyze your performance and generate a tailored report.
              </p>
            </div>

            {/* Benefits */}
            <Card className="bg-hero-gradient border-electric/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-electric mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Performance Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed breakdown of your gameplay patterns and strengths
                    </p>
                  </div>
                  <div className="text-center">
                    <Database className="h-8 w-8 text-electric mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Match History Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive review of your recent matches and trends
                    </p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-electric mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Scout Discovery</h3>
                    <p className="text-sm text-muted-foreground">
                      Get discovered by teams and scouts looking for talent
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select your gaming platforms</CardTitle>
                <CardDescription>
                  Choose the platforms where you have active gaming data. We'll securely connect to analyze your performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {providers.map((provider) => {
                    const Icon = provider.icon;
                    const isSelected = selectedProviders.includes(provider.id);
                    
                    return (
                      <Card 
                        key={provider.id}
                        className={`cursor-pointer transition-all hover:shadow-card ${
                          isSelected ? 'ring-2 ring-electric shadow-glow' : 'hover:border-electric/50'
                        }`}
                        onClick={() => handleProviderToggle(provider.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Icon className={`h-8 w-8 ${provider.color}`} />
                              <div>
                                <h4 className="font-semibold">{provider.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {provider.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-electric" />
                              )}
                              <Checkbox 
                                checked={isSelected}
                                onChange={() => handleProviderToggle(provider.id)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {selectedProviders.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                    <h4 className="font-semibold mb-2">Selected platforms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProviders.map(providerId => {
                        const provider = providers.find(p => p.id === providerId);
                        return provider ? (
                          <Badge key={providerId} variant="default">
                            {provider.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mock OAuth Flow */}
            {selectedProviders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Authorization Preview</CardTitle>
                  <CardDescription>
                    Here's what the authorization process will look like for each platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProviders.map(providerId => {
                    const provider = providers.find(p => p.id === providerId);
                    if (!provider) return null;

                    return (
                      <div key={providerId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <provider.icon className={`h-5 w-5 ${provider.color}`} />
                          <span className="font-medium">{provider.name}</span>
                          <Badge variant="outline">Read-only access</Badge>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Authorize (Mock)
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Consent */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="consent"
                    checked={hasConsent}
                    onCheckedChange={(checked) => setHasConsent(!!checked)}
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <label htmlFor="consent" className="text-sm font-medium cursor-pointer">
                      I authorize this site to access my game data for analysis and to contact me at my registered email ({user?.email}).
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Your data is processed securely and used only for generating your performance report. 
                      You can revoke access at any time through your account settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-center">
              <Button 
                onClick={handleSubmit}
                disabled={selectedProviders.length === 0 || !hasConsent || isLoading}
                variant="hero"
                size="xl"
                className="px-12"
              >
                {isLoading ? 'Authorizing...' : 'Authorize & Submit'}
              </Button>
            </div>

            {/* Privacy Notice */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-electric mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Your privacy is protected</h4>
                    <p className="text-xs text-muted-foreground">
                      We use bank-level encryption and never store your login credentials. 
                      Data is processed anonymously and you maintain full control over your information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}