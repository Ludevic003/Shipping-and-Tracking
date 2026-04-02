import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Package, MapPin, Calendar, AlertCircle, Search, Clock, MessageSquare as MessageSquareWarning, Plus, FileText, Hash } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [shipments, setShipments] = useState([]);
  const [shipmentPage, setShipmentPage] = useState(1);
  const [shipmentTotalPages, setShipmentTotalPages] = useState(1);
  
  const [complaints, setComplaints] = useState([]);
  const [complaintPage, setComplaintPage] = useState(1);
  const [complaintTotalPages, setComplaintTotalPages] = useState(1);
  
  const [loadingShipments, setLoadingShipments] = useState(true);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  
  const [shipmentSearch, setShipmentSearch] = useState('');
  const [complaintFilter, setComplaintFilter] = useState('All');
  
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedShipment, setTrackedShipment] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const fetchShipments = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoadingShipments(true);
      let filterStr = `(sender_name ~ "${currentUser.name}" || receiver_name ~ "${currentUser.name}")`;
      if (shipmentSearch) {
        filterStr += ` && tracking_number ~ "${shipmentSearch}"`;
      }
      
      const result = await pb.collection('shipments').getList(shipmentPage, 20, {
        filter: filterStr,
        sort: '-created',
        $autoCancel: false
      });
      setShipments(result.items);
      setShipmentTotalPages(result.totalPages);
    } catch (error) {
      setShipments([]);
    } finally {
      setLoadingShipments(false);
    }
  }, [currentUser, shipmentPage, shipmentSearch]);

  const fetchComplaints = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoadingComplaints(true);
      let filterStr = `user_id = "${currentUser.id}"`;
      if (complaintFilter !== 'All') {
        filterStr += ` && status = "${complaintFilter}"`;
      }
      
      const result = await pb.collection('complaint_tickets').getList(complaintPage, 20, {
        filter: filterStr,
        sort: '-created',
        $autoCancel: false
      });
      setComplaints(result.items);
      setComplaintTotalPages(result.totalPages);
    } catch (error) {
      setComplaints([]);
    } finally {
      setLoadingComplaints(false);
    }
  }, [currentUser, complaintPage, complaintFilter]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    
    setTrackingLoading(true);
    setTrackingError('');
    setTrackedShipment(null);
    
    try {
      const record = await pb.collection('shipments').getFirstListItem(`tracking_number="${trackingInput.trim()}"`, {
        $autoCancel: false
      });
      setTrackedShipment(record);
    } catch (err) {
      setTrackingError('Shipment not found or you do not have permission to view it.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Open': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>My Dashboard - US Box Mail Services</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {currentUser?.name || 'Client'}</h1>
              <p className="text-slate-500">Manage your shipments and support tickets.</p>
            </div>
            <Button onClick={() => navigate('/complaint-submission')} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
            </Button>
          </div>

          <Tabs defaultValue="shipments" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="shipments">My Shipments</TabsTrigger>
              <TabsTrigger value="track">Track Package</TabsTrigger>
              <TabsTrigger value="complaints">Complaints</TabsTrigger>
            </TabsList>

            <TabsContent value="shipments" className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    Active Shipments
                  </h2>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search tracking number..." 
                      value={shipmentSearch}
                      onChange={(e) => {
                        setShipmentSearch(e.target.value);
                        setShipmentPage(1);
                      }}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="p-6">
                  {loadingShipments ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-32 rounded-xl" />)}
                    </div>
                  ) : shipments.length === 0 ? (
                    <div className="text-center py-16">
                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-900 mb-2">No shipments found</h3>
                      <p className="text-slate-500 max-w-md mx-auto">
                        {shipmentSearch ? "No shipments match your search." : "You don't have any active shipments."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {shipments.map((shipment) => (
                        <div key={shipment.id} className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 bg-white">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Tracking Number</p>
                                <div className="flex items-center gap-2">
                                  <Hash className="w-4 h-4 text-primary" />
                                  <p className="font-bold text-slate-900 text-lg">{shipment.tracking_number}</p>
                                </div>
                                <Badge variant="outline" className={`mt-2 ${getStatusColor(shipment.status)}`}>
                                  {shipment.status || 'Pending'}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Sender</p>
                                <p className="text-sm text-slate-900 truncate">{shipment.sender_name || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Receiver</p>
                                <p className="text-sm text-slate-900 truncate">{shipment.receiver_name || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex flex-row lg:flex-col gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
                              <Button className="flex-1 lg:w-full" onClick={() => navigate(`/tracking/${shipment.tracking_number}`)}>
                                Track Shipment
                              </Button>
                              <Button variant="outline" className="flex-1 lg:w-full" onClick={() => navigate(`/shipments/${shipment.id}`)}>
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {shipmentTotalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <Button 
                        variant="outline" 
                        disabled={shipmentPage === 1} 
                        onClick={() => setShipmentPage(p => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-4 text-sm text-slate-600">
                        Page {shipmentPage} of {shipmentTotalPages}
                      </span>
                      <Button 
                        variant="outline" 
                        disabled={shipmentPage === shipmentTotalPages} 
                        onClick={() => setShipmentPage(p => Math.min(shipmentTotalPages, p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="track" className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-8">
                  <div className="max-w-2xl mx-auto text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Track a Specific Package</h2>
                    <form onSubmit={handleTrack} className="flex gap-3">
                      <Input 
                        placeholder="Enter tracking number (e.g. USBX...)" 
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        className="h-12 text-lg"
                      />
                      <Button type="submit" className="h-12 px-8" disabled={trackingLoading}>
                        {trackingLoading ? 'Searching...' : 'Track'}
                      </Button>
                    </form>
                    {trackingError && <p className="text-red-500 mt-4 text-sm">{trackingError}</p>}
                  </div>

                  {trackedShipment && (
                    <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Tracking Number</p>
                          <h3 className="text-2xl font-bold text-slate-900">{trackedShipment.tracking_number}</h3>
                        </div>
                        <Badge className={`text-sm px-4 py-1 ${getStatusColor(trackedShipment.status)}`}>
                          {trackedShipment.status || 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-2">Sender</p>
                          <div className="text-slate-900 font-medium">
                            {trackedShipment.sender_name || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-2">Receiver</p>
                          <div className="text-slate-900 font-medium">
                            {trackedShipment.receiver_name || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-2">Actions</p>
                          <Button variant="outline" className="w-full" onClick={() => navigate(`/tracking/${trackedShipment.tracking_number}`)}>
                            View Full Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="complaints" className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquareWarning className="w-5 h-5 text-red-500" />
                    Complaint History
                  </h2>
                  <div className="flex items-center gap-3">
                    <Select value={complaintFilter} onValueChange={(val) => {
                      setComplaintFilter(val);
                      setComplaintPage(1);
                    }}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6">
                  {loadingComplaints ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => <Skeleton key={i} className="w-full h-24 rounded-xl" />)}
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="text-center py-16">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-900 mb-2">No complaints found</h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-6">
                        You haven't submitted any complaints yet, or none match your filter.
                      </p>
                      <Button onClick={() => navigate('/complaint-submission')}>Submit a Complaint</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {complaints.map((complaint) => (
                        <div key={complaint.id} className="border border-slate-200 rounded-xl p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="secondary">{complaint.complaint_type}</Badge>
                              <Badge variant="outline" className={getStatusColor(complaint.status)}>
                                {complaint.status || 'Open'}
                              </Badge>
                              <span className="text-xs text-slate-400 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(complaint.created).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1">Shipment: {complaint.shipment_id}</h4>
                            <p className="text-sm text-slate-500 line-clamp-2">{complaint.description}</p>
                          </div>
                          <div className="shrink-0">
                            <Button variant="outline" onClick={() => navigate(`/complaint/${complaint.id}`)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {complaintTotalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <Button 
                        variant="outline" 
                        disabled={complaintPage === 1} 
                        onClick={() => setComplaintPage(p => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-4 text-sm text-slate-600">
                        Page {complaintPage} of {complaintTotalPages}
                      </span>
                      <Button 
                        variant="outline" 
                        disabled={complaintPage === complaintTotalPages} 
                        onClick={() => setComplaintPage(p => Math.min(complaintTotalPages, p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientDashboard;