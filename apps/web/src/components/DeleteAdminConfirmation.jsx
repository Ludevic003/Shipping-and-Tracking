import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const DeleteAdminConfirmation = ({ isOpen, onClose, onSuccess, onAdminDeleted, admin }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!admin) return;
    
    setLoading(true);
    try {
      await pb.collection('admins').delete(admin.id, { $autoCancel: false });
      toast.success(`Admin account ${admin.email} deleted successfully`);
      if (onSuccess) onSuccess();
      if (onAdminDeleted) onAdminDeleted();
      onClose();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error(error.message || 'Failed to delete admin account');
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Admin Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Are you sure you want to delete the admin account for <strong className="text-foreground">{admin.email}</strong>? 
            <br /><br />
            This action cannot be undone and they will immediately lose access to the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : 'Yes, Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAdminConfirmation;