import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AlertCircle, ArrowLeft, Package } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ComplaintForm from '@/components/ComplaintForm.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';

const ComplaintPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const record = await pb.collection('shipments').getOne(id, {
          expand: 'sender_id,receiver_id',
          $autoCancel: false
        });
        
        // Verify access
        const isSender = record.expand?.sender_id?.sender_email === currentUser.email;
        const isReceiver = record.expand?.receiver_id?.receiver_email === currentUser.email;

        if (!isSender && !isReceiver) {
          navigate('/dashboard/client');
          return;
        }

        setShipment(record);
      } catch (error) {
        console.error(error);
        navigate('/dashboard/client');
      } finally {
        setLoading(false);
      }
    };

    if (id && currentUser) {
      fetchShipment();
    }
  }, [id, currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Report Issue - US Box Mail Services</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-3xl">
          <Link to={`/shipments/${id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shipment
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-destructive" />
              Report an Issue
            </h1>
            <p className="text-muted-foreground">
              Submit a complaint or report an issue regarding your shipment. Our support team will review it within 24 hours.
            </p>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-border/50 p-8 shadow-sm">
              <Skeleton className="w-full h-12 mb-6" />
              <Skeleton className="w-full h-32 mb-6" />
              <Skeleton className="w-full h-12" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden contain-layout">
              <div className="bg-secondary/30 p-6 border-b border-border/50 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Shipment Reference</p>
                  <p className="text-lg font-bold text-foreground">{shipment?.tracking_number}</p>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <ComplaintForm 
                  shipmentId={id} 
                  onSuccess={() => navigate('/complaints')} 
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComplaintPage;