import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldCheck, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const TwoFactorAuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verify2FA } = useAuth();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const sessionId = location.state?.sessionId;
  const email = location.state?.email;

  useEffect(() => {
    if (!sessionId || !email) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, email]);

  if (!sessionId || !email) {
    return <Navigate to="/admin/login" replace />;
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await verify2FA(sessionId, code);
      
      if (result.success) {
        toast.success('Authentication successful');
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.error || 'Invalid or expired code.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    
    try {
      const response = await apiServerClient.fetch('/admin/send-2fa-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) throw new Error('Failed to resend code');
      
      toast.success('A new code has been sent to your email.');
      setTimeLeft(600);
    } catch (err) {
      toast.error('Failed to resend code. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <Helmet>
        <title>Two-Factor Authentication - Admin Portal</title>
      </Helmet>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight">Two-Step Verification</CardTitle>
          <CardDescription className="text-slate-400">
            Enter the 6-digit code sent to <br/>
            <span className="font-medium text-slate-300">{email}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex justify-center">
                <Input 
                  id="code" 
                  type="text" 
                  maxLength={6}
                  required 
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-3xl tracking-[0.5em] font-mono h-16 bg-slate-950/50 border-slate-800 text-white focus-visible:ring-emerald-500"
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-slate-500">
                  Code expires in: <span className={timeLeft < 60 ? "text-red-400 font-medium" : "text-slate-300"}>{formatTime(timeLeft)}</span>
                </span>
                <button 
                  type="button" 
                  onClick={handleResend}
                  disabled={resending || timeLeft > 540} // Prevent spamming
                  className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${resending ? 'animate-spin' : ''}`} />
                  Resend Code
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 transition-all duration-200" 
              disabled={loading || code.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-slate-800/50 pt-6">
          <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => navigate('/admin/login')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TwoFactorAuthPage;