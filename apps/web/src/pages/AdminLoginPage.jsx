import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

/*
 * ADMIN LOGIN VERIFICATION CHECKLIST:
 * [x] 1. Valid credentials (newadmin2@example.com / SecurePass123) should return 200 and redirect to /admin.
 * [x] 2. Invalid credentials should return 401 with error message "Invalid email or password".
 * [x] 3. Session should persist after page refresh (handled via AuthContext restoring auth_token).
 * [x] 4. Logout should clear session (localStorage & state) and redirect to /login.
 * [x] 5. Any /hcgi/* requests should return 404 from backend (handled in main.js guard).
 * [x] 6. No 500 errors on login attempts (handled via proper try/catch in admin.js).
 */

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { adminLogin, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated) {
      console.log('[AdminLoginPage] User is already authenticated, redirecting to dashboard');
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log(`[AdminLoginPage] Attempting login for: ${email}`);

    try {
      const result = await adminLogin(email, password);
      
      if (result.success) {
        console.log('[AdminLoginPage] Login successful, redirecting...');
        toast.success('Admin login successful');
        navigate('/admin/dashboard');
      } else {
        console.warn('[AdminLoginPage] Login failed:', result.error);
        setError(result.error || 'Invalid email or password');
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('[AdminLoginPage] Unexpected error during login:', err);
      setError('An unexpected error occurred during login.');
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <Helmet>
        <title>Admin Login - US Box Mail Services</title>
      </Helmet>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-900/20 blur-[100px]" />
      </div>

      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-slate-900/80 backdrop-blur-xl border-slate-800 text-white [&>button]:hidden shadow-2xl">
          <DialogHeader className="space-y-3 pb-6 text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-indigo-500/20">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white tracking-tight">Admin Login</DialogTitle>
            <DialogDescription className="text-slate-400">
              Secure access for authorized personnel only
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                  placeholder="admin@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-11 mt-2 transition-all duration-200" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Login to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
          
          <DialogFooter className="flex-col sm:flex-col gap-4 border-t border-slate-800/50 pt-6 text-center mt-4">
            <Link to="/login" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Not an admin? Go to User Login
            </Link>
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Return to public website
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLoginPage;