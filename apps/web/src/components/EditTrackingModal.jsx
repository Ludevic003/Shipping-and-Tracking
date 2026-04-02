import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';

const EditTrackingModal = ({ isOpen, onClose, shipment, onSuccess }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && shipment) {
      setTrackingNumber(shipment.tracking_number || '');
      setError('');
    }
  }, [isOpen, shipment]);

  const handleSave = async () => {
    if (!trackingNumber || trackingNumber.trim().length < 5) {
      setError('Tracking number must be at least 5 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiServerClient.fetch(`/shipments/${shipment.id}/tracking`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber: trackingNumber.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update tracking number');
      }

      toast.success('Tracking number updated successfully');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tracking Number</DialogTitle>
          <DialogDescription>
            Update the tracking number for this shipment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current-tracking" className="text-slate-500">Current Tracking Number</Label>
            <Input 
              id="current-tracking" 
              value={shipment?.tracking_number || ''} 
              readOnly 
              disabled
              className="bg-slate-50 text-slate-500"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="new-tracking">New Tracking Number</Label>
            <Input 
              id="new-tracking" 
              value={trackingNumber} 
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter new tracking number"
              disabled={loading}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrackingModal;