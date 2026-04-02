import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Package, ArrowLeft, Mail, Lock, User, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, clientLogin, signup, isAuthenticated, isClient, isAdmin } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Parse tab from URL if present or default to user login
  const searchParams = new URLSearchParams(location.search);
  const isSignupRoute = location.pathname === '/signup';
  const defaultTab = isSignupRoute || searchParams.get('tab') === 'signup' ? 'signup' : 'user';
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) navigate('/admin');
      else navigate('/client-dashboard');
    }
  }, [isAuthenticated, isClient, isAdmin, navigate]);

  // Clear errors when switching tabs
  useEffect(() => {
    setError('');
  }, [activeTab]);

  const handleClientLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!loginEmail || !loginPassword) {
      const msg = 'Missing email or password';
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      await clientLogin(loginEmail, loginPassword);
      toast.success('Welcome back!');
      setLoginEmail('');
      setLoginPassword('');
      navigate('/client-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(loginEmail, loginPassword, 'admin');

      if (result.success) {
        toast.success('Admin login successful');
        navigate('/admin');
      } else {
        setError(result.error || 'Invalid email or password');
        toast.error(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An unexpected error occurred during login.');
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (signupPassword !== signupPasswordConfirm) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (signupPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        passwordConfirm: signupPasswordConfirm
      });

      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/client-dashboard');
      } else {
        setError(result.error || 'Failed to create account');
        toast.error(result.error || 'Failed to create account');
      }
    } catch (err) {
      setError('An unexpected error occurred during signup.');
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4 py-12">
      <Helmet>
        <title>Login - US Box Mail Services</title>
        <meta name="description" content="Login or create an account to manage your shipments." />
      </Helmet>

      <div className="w-full max-w-md">
        <Link to="/">
          <Button variant="ghost" className="mb-6 transition-all duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">Welcome Back</h1>
          <p className="text-sm text-center text-muted-foreground mb-8">
            Access your account to manage shipments
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 text-center font-medium">
              {error}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user">
              <form onSubmit={handleClientLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 h-12 text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 h-12 text-foreground"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base transition-all duration-200 active:scale-[0.98]" 
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                  ) : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleAdminLoginSubmit} className="space-y-5 bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 shadow-inner">
                <div className="flex flex-col items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Shield className="w-6 h-6 text-slate-300" />
                  </div>
                  <h3 className="font-semibold text-lg tracking-tight">Admin Portal</h3>
                  <p className="text-xs text-slate-400 text-center mt-1">Restricted access for authorized personnel</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-slate-300">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@usbox.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-slate-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-600"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base bg-white text-slate-900 hover:bg-slate-200 transition-all duration-200 active:scale-[0.98] font-medium mt-2" 
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...</>
                  ) : 'Access Admin Portal'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 h-12 text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-10 h-12 text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={loading}
                      required
                      minLength={8}
                      className="pl-10 h-12 text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupPasswordConfirm}
                      onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                      disabled={loading}
                      required
                      minLength={8}
                      className="pl-10 h-12 text-foreground"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base transition-all duration-200 active:scale-[0.98]" 
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
                  ) : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;