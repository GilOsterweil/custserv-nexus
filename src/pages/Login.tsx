import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import angelSenseLogo from '@/assets/angelsense-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call your custom backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      
      // Store the API key in localStorage for future requests
      localStorage.setItem('apiKey', data.apiKey);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast({
        title: "Login successful",
        description: "Welcome to the admin portal",
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-backdrop flex items-center justify-center p-4 animate-fade-in relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-orange/10 rounded-full translate-x-1/3 translate-y-1/3 animate-pulse-soft"></div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 animate-slide-in">
          <div className="mx-auto w-20 h-20 bg-gradient-teal rounded-curve-lg flex items-center justify-center shadow-soft animate-float p-3">
            <img 
              src={angelSenseLogo} 
              alt="AngelSense Logo" 
              className="w-full h-full object-contain filter brightness-0 invert"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Customer Support
          </h1>
          <p className="text-lg text-muted-foreground">
            Sign in to access the admin portal
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-soft border-0 bg-gradient-card backdrop-blur-sm rounded-curve-lg">
          <CardHeader className="space-y-2 pb-8">
            <CardTitle className="text-3xl text-center font-bold text-foreground">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-lg">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-foreground font-medium text-base">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-12 h-12 rounded-curve border-2 border-border focus:border-primary focus:shadow-focus transition-bounce text-base"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-foreground font-medium text-base">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-12 h-12 rounded-curve border-2 border-border focus:border-primary focus:shadow-focus transition-bounce text-base"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-teal hover:scale-[1.02] active:scale-[0.98] transition-bounce shadow-button text-lg font-semibold rounded-curve"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In to Portal'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2 animate-fade-in">
          <p className="text-muted-foreground">
            🔒 Secure admin access for customer support team
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Connected & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;