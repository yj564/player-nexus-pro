import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';
import { Zap, Eye, EyeOff, Mail } from 'lucide-react';

export default function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    region: '',
    primaryGames: [] as string[],
    discordId: '',
    steamId: '',
    gameId: '',
    agreeToTerms: false,
  });

  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to TalentScope.",
        });
        navigate('/role');
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials",
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await register(registerForm);
      if (result.success) {
        toast({
          title: "Account created!",
          description: "Welcome to TalentScope. Choose your role to continue.",
        });
        navigate('/role');
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "Please check your information",
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

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setForgotEmailSent(true);
    toast({
      title: "Reset link sent",
      description: `Password reset instructions sent to ${forgotEmail}`,
    });
  };

  const regions = [
    'North America',
    'Europe',
    'Asia',
    'South America',
    'Oceania',
    'Africa',
    'Global'
  ];

  const games = [
    'CS:GO',
    'CS2',
    'Valorant',
    'League of Legends',
    'Dota 2',
    'Apex Legends',
    'Overwatch 2',
    'Rainbow Six Siege'
  ];

  return (
    <Layout showNavigation={false}>
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient p-4">
        <div className="w-full max-w-md">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Zap className="h-12 w-12 text-electric" />
                <div className="absolute -top-2 -right-2 h-4 w-4 bg-electric rounded-full animate-pulse opacity-70" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gaming-gradient bg-clip-text text-transparent mb-2">
              TalentScope
            </h1>
            <p className="text-muted-foreground">
              Connect scouts with gaming talent
            </p>
          </div>

          <Card className="shadow-glow border-electric/20">
            <CardHeader className="text-center">
              <CardTitle>Join the platform</CardTitle>
              <CardDescription>
                Sign up or log in to start connecting with esports talent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Forgot password?
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reset Password</DialogTitle>
                            <DialogDescription>
                              Enter your email address and we'll send you a reset link.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="forgot-email">Email</Label>
                              <Input
                                id="forgot-email"
                                type="email"
                                placeholder="Enter your email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                              />
                            </div>
                            <Button 
                              onClick={handleForgotPassword}
                              disabled={forgotEmailSent}
                              className="w-full"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              {forgotEmailSent ? 'Email Sent' : 'Send Reset Link'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      variant="hero"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="Choose username"
                          value={registerForm.username}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Select 
                          value={registerForm.region} 
                          onValueChange={(value) => setRegisterForm(prev => ({ ...prev, region: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map(region => (
                              <SelectItem key={region} value={region}>{region}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create password"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm password"
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Primary Games (select multiple)</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {games.map(game => (
                          <div key={game} className="flex items-center space-x-2">
                            <Checkbox
                              id={`game-${game}`}
                              checked={registerForm.primaryGames.includes(game)}
                              onCheckedChange={(checked) => {
                                setRegisterForm(prev => ({
                                  ...prev,
                                  primaryGames: checked
                                    ? [...prev.primaryGames, game]
                                    : prev.primaryGames.filter(g => g !== game)
                                }));
                              }}
                            />
                            <Label htmlFor={`game-${game}`} className="text-sm">{game}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="discord">Discord ID</Label>
                        <Input
                          id="discord"
                          placeholder="Optional"
                          value={registerForm.discordId}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, discordId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="steam">Steam ID</Label>
                        <Input
                          id="steam"
                          placeholder="Optional"
                          value={registerForm.steamId}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, steamId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="game-id">Game ID</Label>
                        <Input
                          id="game-id"
                          placeholder="Optional"
                          value={registerForm.gameId}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, gameId: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={registerForm.agreeToTerms}
                        onCheckedChange={(checked) => setRegisterForm(prev => ({ ...prev, agreeToTerms: !!checked }))}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{' '}
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Terms and Privacy Policy
                        </Button>
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      variant="hero"
                      size="lg"
                      disabled={isLoading || !registerForm.agreeToTerms}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}