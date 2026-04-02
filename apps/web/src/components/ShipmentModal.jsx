import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShipmentForm from '@/components/ShipmentForm.jsx';

const ShipmentModal = ({ open, onOpenChange, onSuccess }) => {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Shipment</DialogTitle>
        </DialogHeader>
        <ShipmentForm mode="add" onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentModal;