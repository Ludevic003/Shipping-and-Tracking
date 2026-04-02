import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import apiServerClient from '@/lib/apiServerClient';
import { toast } from 'sonner';

const AdminManagementModal = ({ isOpen, onClose, admin, onSuccess }) => {
  const isEditing = !!admin;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'agent',
    status: true,
    password: ''
  });

  useEffect(() => {
    if (admin && isOpen) {
      setFormData({
        email: admin.email || '',
        role: admin.role || 'agent',
        status: admin.account_locked === false,
        password: ''
      });
    } else if (isOpen) {
      setFormData({
        email: '',
        role: 'agent',
        status: true,
        password: ''
      });
    }
  }, [admin, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        role: formData.role,
        account_locked: !formData.status
      };

      if (!isEditing) {
        if (!formData.password) throw new Error('Password is required for new admins');
        payload.password = formData.password;
      }

      const endpoint = isEditing ? `/admin/${admin.id}` : '/admin/create';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await apiServerClient.fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save admin');
      }

      toast.success(isEditing ? 'Admin updated successfully' : 'Admin created successfully');
      onSuccess();
      onClose();
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
          <DialogTitle>{isEditing ? `Edit Admin: ${admin.email}` : 'Add New Admin'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update role and access status.' : 'Create a new administrative account.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(val) => handleChange('role', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Super Admin</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="freight_forwarder">Freight Forwarder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input 
                id="password" 
                type="text" 
                required 
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Secure password"
              />
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Account Status</Label>
              <p className="text-sm text-muted-foreground">
                {formData.status ? 'Active and can log in' : 'Locked and cannot log in'}
              </p>
            </div>
            <Switch 
              checked={formData.status}
              onCheckedChange={(val) => handleChange('status', val)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminManagementModal;