import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, Calendar, Search, User, Box, Clock, CheckCircle2, Truck, Package, AlertCircle, ShieldAlert, Clock4 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const TrackingPage = () => {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(trackingNumber || '');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(!!trackingNumber);
  const [error, setError] = useState('');

  const fetchShipment = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');
    setShipment(null);

    try {
      const result = await pb.collection('shipments_v2').getFullList({
        filter: `tracking_number="${query}"`,
        $autoCancel: false
      });
      
      if (result.length === 0) {
        throw new Error("Shipment not found");
      }
      
      setShipment(result[0]);
      
      if (result[0].tracking_number !== trackingNumber) {
        window.history.replaceState(null, '', `/tracking/${result[0].tracking_number}`);
      }
    } catch (err) {
      console.error(err);
      setError('We could not find a shipment with that tracking number. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingNumber) {
      fetchShipment(trackingNumber);
    }
  }, [trackingNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tracking/${searchQuery.trim()}`);
    }
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'Pending': return { colorClass: 'bg-slate-200 text-slate-800', icon: Package, label: 'Pending' };
      case 'Order has been picked up': return { colorClass: 'bg-blue-100 text-blue-800', icon: Package, label: 'Order Picked Up' };
      case 'In Transit': return { colorClass: 'bg-indigo-100 text-indigo-800', icon: Truck, label: 'In Transit' };
      case 'Out for Delivery': return { colorClass: 'bg-purple-100 text-purple-800', icon: MapPin, label: 'Out for Delivery' };
      case 'On Hold': return { colorClass: 'bg-amber-100 text-amber-800', icon: ShieldAlert, label: 'On Hold' };
      case 'In Custom Clearing': return { colorClass: 'bg-orange-100 text-orange-800', icon: Clock4, label: 'In Custom Clearing' };
      case 'Delivery Attempt': return { colorClass: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Delivery Attempt' };
      case 'Delivered': return { colorClass: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2, label: 'Delivered' };
      default: return { colorClass: 'bg-slate-100 text-slate-800', icon: AlertCircle, label: status || 'Unknown' };
    }
  };

  const formatAddress = (province, country, postal) => {
    const parts = [province, country, postal].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Track Shipment - US Box Mail Services</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12 md:py-20 mt-16">
        <div className="container-custom max-w-5xl">
          
          {/* Search Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Track Your Package</h1>
            <p className="text-slate-500 mb-8 text-lg">Enter your tracking number for real-time updates.</p>
            
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter tracking number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white shadow-sm border-slate-200 focus-visible:ring-primary"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 text-lg font-semibold shadow-sm">
                Track
              </Button>
            </form>
          </div>

          {/* Results Section */}
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <Skeleton className="w-full h-32 mb-8 rounded-xl" />
              <div className="space-y-6">
                <Skeleton className="w-full h-32 rounded-xl" />
                <Skeleton className="w-full h-64 rounded-xl" />
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-10 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Shipment Not Found</h3>
              <p className="text-slate-600 text-lg">{error}</p>
            </div>
          )}

          {shipment && !loading && (
            <div className="space-y-8">
              
              {/* Status Banner */}
              <div className={`w-full rounded-2xl shadow-sm overflow-hidden border ${getStatusConfig(shipment.status).colorClass.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 bg-')}`}>
                <div className={`p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 ${getStatusConfig(shipment.status).colorClass}`}>
                  <div className="flex items-center gap-6">
                    <div className="bg-white/50 p-5 rounded-full backdrop-blur-sm">
                      {React.createElement(getStatusConfig(shipment.status).icon, { className: "w-12 h-12" })}
                    </div>
                    <div>
                      <p className="opacity-80 font-semibold uppercase tracking-widest text-sm mb-2">Current Status</p>
                      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none">
                        {getStatusConfig(shipment.status).label}
                      </h2>
                      <p className="mt-3 opacity-90 font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Last updated: {new Date(shipment.updated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-center md:text-right bg-white/50 px-8 py-6 rounded-2xl backdrop-blur-sm w-full md:w-auto">
                    <p className="opacity-80 font-semibold uppercase tracking-widest text-sm mb-2">Tracking Number</p>
                    <p className="text-3xl font-mono font-bold tracking-wider">{shipment.tracking_number}</p>
                  </div>
                </div>
              </div>

              {/* Main Tracking Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <MapPin className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Origin</p>
                        <p className="font-semibold text-slate-900 text-lg">{shipment.pickup_location || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-xl">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Destination</p>
                        <p className="font-semibold text-slate-900 text-lg">{shipment.destination_location || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <Calendar className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Est. Delivery</p>
                        <p className="font-semibold text-slate-900 text-lg">{shipment.estimated_delivery_date ? new Date(shipment.estimated_delivery_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6 md:p-8 bg-slate-50/50">
                  <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-slate-400" /> Tracking History
                  </h3>
                  <div className="relative pl-8 space-y-8 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-slate-200">
                    
                    {/* Last Updated */}
                    <div className="relative">
                      <div className={`absolute -left-8 w-6 h-6 ${getStatusConfig(shipment.status).colorClass.split(' ')[0]} rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm`}>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                          <p className="font-bold text-slate-900 text-lg">{shipment.status}</p>
                          <p className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                            {new Date(shipment.updated).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-slate-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          Current Location: <span className="font-medium text-slate-900">{shipment.current_location || 'N/A'}</span>
                        </p>
                        {shipment.tracking_notes && (
                          <p className="mt-3 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            Note: {shipment.tracking_notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Created */}
                    <div className="relative">
                      <div className="absolute -left-8 w-6 h-6 bg-slate-300 rounded-full border-4 border-white flex items-center justify-center z-10">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      </div>
                      <div className="bg-white/60 p-5 rounded-xl border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                          <p className="font-bold text-slate-700 text-lg">Shipment Created</p>
                          <p className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                            {new Date(shipment.created).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-slate-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          Location: <span className="font-medium text-slate-900">{shipment.pickup_location || 'N/A'}</span>
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Comprehensive Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Sender & Receiver */}
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                    <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-slate-900 border-b border-slate-100 pb-4">
                      <User className="w-6 h-6 text-slate-400" /> Sender Details
                    </h3>
                    <div className="space-y-4 text-base">
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Name:</span> <span className="col-span-2 font-semibold text-slate-900">{shipment.sender_name || 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Contact:</span> <span className="col-span-2 text-slate-700">{shipment.sender_contact || 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Address:</span> <span className="col-span-2 text-slate-700">{shipment.sender_address || 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Location:</span> <span className="col-span-2 text-slate-700">{formatAddress(shipment.sender_province, shipment.sender_country, shipment.sender_postal_code)}</span></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                    <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-slate-900 border-b border-slate-100 pb-4">
                      <User className="w-6 h-6 text-slate-400" /> Receiver Details
                    </h3>
                    <div className="space-y-4 text-base">
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Name:</span> <span className="col-span-2 font-semibold text-slate-900">{shipment.receiver_name || 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Contact:</span> <span className="col-span-2 text-slate-700">{shipment.receiver_contact || 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Address:</span> <span className="col-span-2 text-slate-700">{shipment.receiver_address || 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Location:</span> <span className="col-span-2 text-slate-700">{formatAddress(shipment.receiver_province, shipment.receiver_country, shipment.receiver_postal_code)}</span></div>
                    </div>
                  </div>
                </div>

                {/* Product */}
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                    <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-slate-900 border-b border-slate-100 pb-4">
                      <Box className="w-6 h-6 text-slate-400" /> Product Details
                    </h3>
                    <div className="space-y-4 text-base">
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Item:</span> <span className="col-span-2 font-semibold text-slate-900">{shipment.product_name || 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Category:</span> <span className="col-span-2 text-slate-700">{shipment.product_category || 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Quantity:</span> <span className="col-span-2 text-slate-700">{shipment.product_quantity || 1}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Weight:</span> <span className="col-span-2 text-slate-700">{shipment.product_weight ? `${shipment.product_weight} kg` : 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Dimensions:</span> <span className="col-span-2 text-slate-700">{shipment.product_dimensions_length ? `${shipment.product_dimensions_length}x${shipment.product_dimensions_width}x${shipment.product_dimensions_height} cm` : 'N/A'}</span></div>
                      <div className="grid grid-cols-3 gap-2"><span className="text-slate-500 font-medium">Value:</span> <span className="col-span-2 font-medium text-slate-900">${shipment.product_value?.toFixed(2) || '0.00'}</span></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackingPage;