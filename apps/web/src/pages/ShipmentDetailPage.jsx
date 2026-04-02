import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Package, MapPin, Calendar, User, AlertCircle, ArrowLeft, ShieldCheck, DollarSign, Navigation } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ShipmentDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const record = await pb.collection('shipments').getOne(id, {
          expand: 'sender_id,receiver_id,product_id',
          $autoCancel: false
        });

        // Verify access (must be sender or receiver)
        const isSender = record.expand?.sender_id?.sender_email === currentUser.email;
        const isReceiver = record.expand?.receiver_id?.receiver_email === currentUser.email;

        if (!isSender && !isReceiver) {
          throw new Error("You do not have permission to view this shipment.");
        }

        setShipment(record);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load shipment details.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && id) {
      fetchShipment();
    }
  }, [id, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container-custom py-12">
          <Skeleton className="w-32 h-10 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full h-64 rounded-2xl" />
              <Skeleton className="w-full h-64 rounded-2xl" />
            </div>
            <Skeleton className="w-full h-96 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container-custom py-24 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={() => navigate('/dashboard/client')}>Return to Dashboard</Button>
        </main>
      </div>
    );
  }

  const product = shipment.expand?.product_id;
  const sender = shipment.expand?.sender_id;
  const receiver = shipment.expand?.receiver_id;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Shipment {shipment.tracking_number} - US Box Mail Services</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12">
        <div className="container-custom">
          <Link to="/dashboard/client" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  {shipment.tracking_number}
                </h1>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {shipment.status}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Estimated Delivery: {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate(`/shipments/${shipment.id}/complaint`)}>
                <AlertCircle className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
              <Button onClick={() => navigate(`/shipments/${shipment.id}/track`)}>
                <Navigation className="w-4 h-4 mr-2" />
                Live Tracking
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Route Info */}
              <div className="bg-white rounded-2xl border border-border/50 p-6 sm:p-8 shadow-sm contain-layout">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Route Details
                </h2>
                <div className="relative pl-8 space-y-8 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-border">
                  <div className="relative">
                    <div className="absolute -left-8 w-6 h-6 bg-secondary rounded-full border-4 border-white flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Origin</p>
                    <p className="text-lg font-medium text-foreground">{shipment.pickup_location}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 w-6 h-6 bg-primary/20 rounded-full border-4 border-white flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Current Location</p>
                    <p className="text-lg font-medium text-foreground">{shipment.current_location}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-8 w-6 h-6 bg-secondary rounded-full border-4 border-white flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Destination</p>
                    <p className="text-lg font-medium text-foreground">{shipment.destination_location}</p>
                  </div>
                </div>
              </div>

              {/* Parties Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm contain-layout">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    Sender Details
                  </h2>
                  <div className="space-y-3 text-sm">
                    <p><span className="text-muted-foreground block mb-0.5">Name</span> <span className="font-medium">{sender?.sender_name}</span></p>
                    <p><span className="text-muted-foreground block mb-0.5">Email</span> <span className="font-medium">{sender?.sender_email}</span></p>
                    <p><span className="text-muted-foreground block mb-0.5">Contact</span> <span className="font-medium">{sender?.sender_contact}</span></p>
                    <p><span className="text-muted-foreground block mb-0.5">Address</span> <span className="font-medium">{sender?.sender_address}</span></p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm contain-layout">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    Receiver Details
                  </h2>
                  <div className="space-y-3 text-sm">
                    <p><span className="text-muted-foreground block mb-0.5">Name</span> <span className="font-medium">{receiver?.receiver_name}</span></p>
                    <p><span className="text-muted-foreground block mb-0.5">Email</span> <span className="font-medium">{receiver?.receiver_email}</span></p>
                    <p><span className="text-muted-foreground block mb-0.5">Contact</span> <span className="font-medium">{receiver?.receiver_contact}</span></p>
                    <p><span className="text-muted-foreground block mb-0.5">Address</span> <span className="font-medium">{receiver?.receiver_address}</span></p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Product & Insurance */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm contain-layout">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Package Contents
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Item Name</p>
                    <p className="font-medium text-foreground">{product?.product_name}</p>
                  </div>
                  {product?.product_description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm text-foreground">{product.product_description}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3 border-y border-border/50">
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <span className="font-medium">{product?.product_quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Declared Value</span>
                    <span className="font-medium flex items-center">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      {product?.product_value?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Product Images */}
                {product?.product_images && product.product_images.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-sm font-medium text-foreground mb-3">Attached Images</p>
                    <div className="grid grid-cols-2 gap-2">
                      {product.product_images.map((img, idx) => (
                        <a 
                          key={idx} 
                          href={pb.files.getUrl(product, img)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block aspect-square rounded-lg overflow-hidden border border-border/50 hover:opacity-80 transition-opacity"
                        >
                          <img 
                            src={pb.files.getUrl(product, img)} 
                            alt={`Product ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-secondary/30 rounded-2xl border border-border/50 p-6 contain-layout">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Insurance Status
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  This shipment is covered under our standard insurance policy based on the declared value.
                </p>
                <div className="bg-white p-4 rounded-xl border border-border/50 flex justify-between items-center">
                  <span className="text-sm font-medium">Coverage Amount</span>
                  <span className="font-bold text-primary">${product?.product_value?.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShipmentDetailPage;