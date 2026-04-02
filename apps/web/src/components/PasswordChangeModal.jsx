import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const PasswordChangeModal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const requirements = [
    { id: 'length', text: 'At least 8 characters', regex: /.{8,}/ },
    { id: 'upper', text: 'One uppercase letter', regex: /[A-Z]/ },
    { id: 'lower', text: 'One lowercase letter', regex: /[a-z]/ },
    { id: 'number', text: 'One number', regex: /[0-9]/ },
    { id: 'special', text: 'One special character', regex: /[^A-Za-z0-9]/ }
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isPasswordValid = requirements.every(req => req.regex.test(formData.newPassword));
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.newPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast.error('Password does not meet all requirements');
      return;
    }
    
    if (!passwordsMatch) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await apiServerClient.fetch('/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success('Password changed successfully. Please log in again.');
      onClose();
      
      setTimeout(() => {
        logout();
      }, 2000);
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update your account password. You will be logged out after a successful change.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input 
              id="currentPassword" 
              name="currentPassword"
              type="password" 
              required 
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input 
              id="newPassword" 
              name="newPassword"
              type="password" 
              required 
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword"
              type="password" 
              required 
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
            <p className="text-sm font-medium text-slate-700 mb-2">Password Requirements:</p>
            {requirements.map(req => {
              const isValid = req.regex.test(formData.newPassword);
              return (
                <div key={req.id} className="flex items-center gap-2 text-sm">
                  {isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300" />
                  )}
                  <span className={isValid ? "text-slate-700" : "text-slate-500"}>{req.text}</span>
                </div>
              );
            })}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isPasswordValid || !passwordsMatch}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeModal;