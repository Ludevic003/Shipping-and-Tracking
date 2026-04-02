import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle, UserCog } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const EditAdminModal = ({ isOpen, onClose, onSuccess, onAdminUpdated, admin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    role: 'admin',
    status: 'active'
  });

  useEffect(() => {
    if (admin && isOpen) {
      setFormData({
        role: admin.role || 'admin',
        status: admin.status || 'active'
      });
      setError('');
    }
  }, [admin, isOpen]);

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin) return;

    setLoading(true);
    setError('');

    try {
      await pb.collection('admins').update(admin.id, {
        role: formData.role,
        status: formData.status
      }, { $autoCancel: false });

      toast.success('Admin account updated successfully');
      if (onSuccess) onSuccess();
      if (onAdminUpdated) onAdminUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating admin:', err);
      setError(err.message || 'Failed to update admin account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-primary" />
            Edit Admin Account
          </DialogTitle>
          <DialogDescription>
            Update role and access status for this user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email Address</Label>
            <Input
              id="edit-email"
              value={admin.email}
              disabled
              className="bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange} disabled={loading}>
              <SelectTrigger id="edit-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="freight_forwarder">Freight Forwarder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Account Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange} disabled={loading}>
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Inactive users cannot log into the system.
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminModal;