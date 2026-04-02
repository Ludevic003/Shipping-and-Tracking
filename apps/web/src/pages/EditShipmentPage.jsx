import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ShipmentForm from '@/components/ShipmentForm.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const EditShipmentPage = ({ isNew = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      fetchShipment();
    }
  }, [id, isNew]);

  const fetchShipment = async () => {
    setLoading(true);
    setError('');
    try {
      const record = await pb.collection('shipments_v2').getOne(id, { $autoCancel: false });
      setShipment(record);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch shipment details. The record may have been deleted.');
      toast.error('Failed to fetch shipment details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await pb.collection('shipments_v2').delete(id, { $autoCancel: false });
      toast.success('Shipment deleted successfully');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete shipment');
    }
  };

  const handleSuccess = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>{isNew ? 'Add New Shipment' : `Edit Shipment ${shipment?.tracking_number || ''}`} - Admin Dashboard</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/admin">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {isNew ? 'Create New Shipment' : 'Edit Shipment'}
                </h1>
                {!isNew && shipment && (
                  <p className="text-base text-slate-500">
                    Tracking Number: <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">{shipment.tracking_number}</span>
                  </p>
                )}
              </div>
              {!isNew && shipment && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Shipment
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete shipment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this shipment? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {error ? (
              <div className="text-center py-12 bg-destructive/5 rounded-xl border border-destructive/20">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive font-medium mb-4">{error}</p>
                <div className="flex justify-center gap-4">
                  <Button onClick={fetchShipment} variant="outline">Retry</Button>
                  <Button onClick={() => navigate('/admin')} variant="default">Return to Dashboard</Button>
                </div>
              </div>
            ) : loading ? (
              <div className="space-y-8">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </div>
            ) : (
              <ShipmentForm 
                mode={isNew ? 'add' : 'edit'} 
                initialData={shipment}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditShipmentPage;