import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { Search, BarChart3, Users, TrendingUp } from 'lucide-react';

export default function RoleSelection() {
  const { setUserRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'scout' | 'player') => {
    setUserRole(role);
    
    if (role === 'scout') {
      navigate('/scout');
    } else {
      navigate('/player/connect');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Path</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              TalentScope connects the esports ecosystem. Are you looking to discover talent or showcase your skills?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Scout Card */}
            <Card className="shadow-glow border-electric/20 hover:shadow-glow hover:border-electric/40 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-electric/10 rounded-2xl w-fit group-hover:bg-electric/20 transition-colors">
                  <Search className="h-12 w-12 text-electric" />
                </div>
                <CardTitle className="text-2xl">Scout</CardTitle>
                <CardDescription className="text-base">
                  Search for players by performance, style, and potential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-electric" />
                    <span className="text-sm">Access player database</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-electric" />
                    <span className="text-sm">Advanced performance analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-electric" />
                    <span className="text-sm">AI-powered talent discovery</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleRoleSelect('scout')}
                  variant="hero"
                  size="xl"
                  className="w-full mt-6"
                >
                  Continue as Scout
                </Button>
              </CardContent>
            </Card>

            {/* Player Card */}
            <Card className="shadow-glow border-electric/20 hover:shadow-glow hover:border-electric/40 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-electric/10 rounded-2xl w-fit group-hover:bg-electric/20 transition-colors">
                  <BarChart3 className="h-12 w-12 text-electric" />
                </div>
                <CardTitle className="text-2xl">Player</CardTitle>
                <CardDescription className="text-base">
                  Connect your game data to get a tailored performance report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-electric" />
                    <span className="text-sm">Detailed performance analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-electric" />
                    <span className="text-sm">Career development insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-electric" />
                    <span className="text-sm">Get discovered by scouts</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleRoleSelect('player')}
                  variant="hero"
                  size="xl"
                  className="w-full mt-6"
                >
                  Continue as Player
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              You can always change your role later in settings
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}