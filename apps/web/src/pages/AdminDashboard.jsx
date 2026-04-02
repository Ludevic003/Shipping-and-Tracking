import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Package, Search, Trash2, Plus, Edit2, Loader2, FileText, Receipt, Users, ShieldAlert, ShieldCheck, UserPlus, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import BLDownloadModal from '@/components/BLDownloadModal.jsx';
import InvoiceDownloadModal from '@/components/InvoiceDownloadModal.jsx';
import CreateAdminModal from '@/components/CreateAdminModal.jsx';
import EditAdminModal from '@/components/EditAdminModal.jsx';
import DeleteAdminConfirmation from '@/components/DeleteAdminConfirmation.jsx';
import EditTrackingModal from '@/components/EditTrackingModal.jsx';

const AdminDashboard = () => {
  const [trackings, setTrackings] = useState([]);
  const [loadingShipments, setLoadingShipments] = useState(true);
  const [shipmentSearchQuery, setShipmentSearchQuery] = useState('');
  const [shipmentPage, setShipmentPage] = useState(1);
  const [shipmentTotalPages, setShipmentTotalPages] = useState(1);
  
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  
  const [showBLModal, setShowBLModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  
  const [showEditTrackingModal, setShowEditTrackingModal] = useState(false);
  const [selectedShipmentForTracking, setSelectedShipmentForTracking] = useState(null);
  
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const fetchTrackings = useCallback(async () => {
    try {
      setLoadingShipments(true);
      const filter = shipmentSearchQuery 
        ? `tracking_number ~ "${shipmentSearchQuery}" || status ~ "${shipmentSearchQuery}" || sender_name ~ "${shipmentSearchQuery}" || receiver_name ~ "${shipmentSearchQuery}"`
        : '';
        
      const result = await pb.collection('shipments_v2').getList(shipmentPage, 20, {
        sort: '-created',
        filter,
        $autoCancel: false
      });
      setTrackings(result.items);
      setShipmentTotalPages(result.totalPages);
    } catch (error) {
      setTrackings([]);
      if (error.status !== 404) {
        toast.error('Failed to load shipments');
      }
    } finally {
      setLoadingShipments(false);
    }
  }, [shipmentPage, shipmentSearchQuery]);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoadingAdmins(true);
      const filter = adminSearchQuery 
        ? `email ~ "${adminSearchQuery}" || role ~ "${adminSearchQuery}"`
        : '';
        
      const result = await pb.collection('admins').getList(1, 50, {
        sort: '-created',
        filter,
        $autoCancel: false
      });
      setAdmins(result.items);
    } catch (error) {
      setAdmins([]);
      if (error.status !== 404) {
        toast.error('Failed to load admin users');
      }
    } finally {
      setLoadingAdmins(false);
    }
  }, [adminSearchQuery]);

  useEffect(() => {
    fetchTrackings();
  }, [fetchTrackings]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleDeleteShipment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) return;
    
    try {
      await pb.collection('shipments_v2').delete(id, { $autoCancel: false });
      toast.success('Shipment deleted successfully');
      fetchTrackings();
    } catch (error) {
      toast.error('Failed to delete shipment');
    }
  };

  const getStatusColorClass = (status) => {
    switch(status) {
      case 'Pending': return 'bg-slate-100 text-slate-800';
      case 'Order has been picked up': return 'bg-blue-100 text-blue-800';
      case 'In Transit': return 'bg-indigo-100 text-indigo-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'On Hold': return 'bg-amber-100 text-amber-800';
      case 'In Custom Clearing': return 'bg-orange-100 text-orange-800';
      case 'Delivery Attempt': return 'bg-red-100 text-red-800';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formatRole = (role) => {
    if (!role) return 'Unknown';
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="container-custom py-12">
      <Helmet>
        <title>Admin Dashboard - US Box</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage shipments and system users.</p>
      </div>

      <Tabs defaultValue="shipments" className="space-y-6">
        <TabsList className="bg-slate-100/50 p-1">
          <TabsTrigger value="shipments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Package className="w-4 h-4 mr-2" /> Shipments
          </TabsTrigger>
          <TabsTrigger value="admins" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="w-4 h-4 mr-2" /> Admin Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-6 focus-visible:outline-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search shipments..." 
                value={shipmentSearchQuery}
                onChange={(e) => {
                  setShipmentSearchQuery(e.target.value);
                  setShipmentPage(1);
                }}
                className="pl-9 bg-white"
              />
            </div>
            <Link to="/admin/shipments/new">
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Create New Shipment
              </Button>
            </Link>
          </div>

          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              {loadingShipments ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : trackings.length === 0 ? (
                <div className="text-center py-16 bg-slate-50/50">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No shipments found</h3>
                  <p className="text-slate-500 mt-1">Create a new shipment to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Tracking Number</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Sender</th>
                        <th className="px-6 py-4 font-semibold">Receiver</th>
                        <th className="px-6 py-4 font-semibold">Est. Delivery</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {trackings.map(track => (
                        <tr key={track.id} className="hover:bg-slate-50/80 transition-colors bg-white">
                          <td className="px-6 py-4 font-mono font-medium text-slate-900">{track.tracking_number}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColorClass(track.status)}`}>
                              {track.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <div className="font-medium text-slate-900">{track.sender_name || 'N/A'}</div>
                            <div className="text-xs">{track.sender_country || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <div className="font-medium text-slate-900">{track.receiver_name || 'N/A'}</div>
                            <div className="text-xs">{track.receiver_country || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {track.estimated_delivery_date ? new Date(track.estimated_delivery_date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedShipmentForTracking(track);
                                  setShowEditTrackingModal(true);
                                }}
                                title="Edit Tracking Number"
                              >
                                <Hash className="w-4 h-4 text-slate-600" />
                              </Button>

                              <Link to={`/admin/shipments/${track.id}/edit`}>
                                <Button variant="ghost" size="sm" title="Edit Shipment" className="h-8 w-8 p-0">
                                  <Edit2 className="w-4 h-4 text-slate-600" />
                                </Button>
                              </Link>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedShipment(track);
                                  setShowBLModal(true);
                                }}
                                title="Download Bill of Lading"
                              >
                                <FileText className="w-4 h-4 text-blue-600" />
                              </Button>

                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedShipment(track);
                                  setShowInvoiceModal(true);
                                }}
                                title="Download Invoice"
                              >
                                <Receipt className="w-4 h-4 text-green-600" />
                              </Button>

                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteShipment(track.id)}
                                title="Delete Shipment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {shipmentTotalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
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
        </TabsContent>

        <TabsContent value="admins" className="space-y-6 focus-visible:outline-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by email or role..." 
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
            <Button onClick={() => setShowCreateAdminModal(true)} className="w-full sm:w-auto">
              <UserPlus className="w-4 h-4 mr-2" /> Create New Admin
            </Button>
          </div>

          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              {loadingAdmins ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-16 bg-slate-50/50">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No admin users found</h3>
                  <p className="text-slate-500 mt-1">Try adjusting your search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Email</th>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Created Date</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admins.map(admin => (
                        <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors bg-white">
                          <td className="px-6 py-4 font-medium text-slate-900">{admin.email}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {formatRole(admin.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {admin.status === 'inactive' ? (
                              <span className="inline-flex items-center gap-1.5 text-destructive text-xs font-medium">
                                <ShieldAlert className="w-3.5 h-3.5" /> Inactive
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                                <ShieldCheck className="w-3.5 h-3.5" /> Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {new Date(admin.created).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setShowEditAdminModal(true);
                                }}
                                title="Edit Admin"
                              >
                                <Edit2 className="w-4 h-4 text-slate-600" />
                              </Button>

                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setShowDeleteAdminModal(true);
                                }}
                                title="Delete Admin"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BLDownloadModal 
        isOpen={showBLModal} 
        onClose={() => setShowBLModal(false)} 
        shipment={selectedShipment} 
      />
      
      <InvoiceDownloadModal 
        isOpen={showInvoiceModal} 
        onClose={() => setShowInvoiceModal(false)} 
        shipment={selectedShipment} 
      />

      <CreateAdminModal
        isOpen={showCreateAdminModal}
        onClose={() => setShowCreateAdminModal(false)}
        onSuccess={fetchAdmins}
        onAdminCreated={fetchAdmins}
      />

      <EditAdminModal
        isOpen={showEditAdminModal}
        onClose={() => {
          setShowEditAdminModal(false);
          setSelectedAdmin(null);
        }}
        onSuccess={fetchAdmins}
        onAdminUpdated={fetchAdmins}
        admin={selectedAdmin}
      />

      <DeleteAdminConfirmation
        isOpen={showDeleteAdminModal}
        onClose={() => {
          setShowDeleteAdminModal(false);
          setSelectedAdmin(null);
        }}
        onSuccess={fetchAdmins}
        onAdminDeleted={fetchAdmins}
        admin={selectedAdmin}
      />
      
      <EditTrackingModal
        isOpen={showEditTrackingModal}
        onClose={() => {
          setShowEditTrackingModal(false);
          setSelectedShipmentForTracking(null);
        }}
        shipment={selectedShipmentForTracking}
        onSuccess={fetchTrackings}
      />

    </div>
  );
};

export default AdminDashboard;