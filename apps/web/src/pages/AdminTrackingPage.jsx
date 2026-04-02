import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Edit2, Eye, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const AdminTrackingPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchShipments = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const options = {
        sort: '-created',
        expand: 'sender_id,receiver_id',
        $autoCancel: false
      };
      
      if (search) {
        options.filter = `tracking_number ~ "${search}" || expand.sender_id.sender_name ~ "${search}" || expand.receiver_id.receiver_name ~ "${search}"`;
      }
      
      const result = await pb.collection('shipments').getList(1, 50, options);
      setShipments(result.items);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Failed to load shipments. Please try again.');
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchShipments(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusChange = async (shipmentId, newStatus) => {
    setUpdatingId(shipmentId);
    try {
      await pb.collection('shipments').update(shipmentId, { status: newStatus }, { $autoCancel: false });
      toast.success('Shipment status updated successfully');
      
      // Update local state to reflect change immediately
      setShipments(prev => prev.map(s => 
        s.id === shipmentId ? { ...s, status: newStatus } : s
      ));
    } catch (error) {
      console.error(error);
      toast.error('Failed to update shipment status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Manage Tracking - Admin</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-8 mt-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tracking Management</h1>
              <p className="text-slate-500">Update shipment statuses and locations.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search tracking or name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
          </div>

          {error ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="text-destructive font-medium mb-4">{error}</p>
              <Button onClick={() => fetchShipments(searchQuery)} variant="outline">Retry</Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Tracking #</th>
                      <th className="px-6 py-4 font-semibold">Sender Name</th>
                      <th className="px-6 py-4 font-semibold">Receiver Name</th>
                      <th className="px-6 py-4 font-semibold">Current Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="p-6">
                          <div className="space-y-3">
                            {[1,2,3,4].map(i => <Skeleton key={i} className="w-full h-12" />)}
                          </div>
                        </td>
                      </tr>
                    ) : shipments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-slate-500">
                          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                          <p className="text-lg font-medium text-slate-900">No shipments found</p>
                          <p>Try adjusting your search query.</p>
                        </td>
                      </tr>
                    ) : (
                      shipments.map((shipment) => (
                        <tr key={shipment.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {shipment.tracking_number}
                          </td>
                          
                          <td className="px-6 py-4 text-slate-600">
                            {shipment.expand?.sender_id?.sender_name || 'N/A'}
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {shipment.expand?.receiver_id?.receiver_name || 'N/A'}
                          </td>

                          <td className="px-6 py-4">
                            <Select 
                              value={shipment.status} 
                              onValueChange={(val) => handleStatusChange(shipment.id, val)}
                              disabled={updatingId === shipment.id}
                            >
                              <SelectTrigger className="h-9 w-[180px]">
                                {updatingId === shipment.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Order has been picked up">Order has been picked up</SelectItem>
                                <SelectItem value="In Transit">In Transit</SelectItem>
                                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                                <SelectItem value="In Custom Clearing">In Custom Clearing</SelectItem>
                                <SelectItem value="Delivery Attempt">Delivery Attempt</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/tracking/${shipment.tracking_number}`}>
                                <Button size="sm" variant="ghost" className="text-slate-500 hover:text-primary">
                                  <Eye className="w-4 h-4 mr-1" /> View
                                </Button>
                              </Link>
                              <Link to={`/admin/shipments/${shipment.id}/edit`}>
                                <Button size="sm" variant="ghost" className="text-slate-500 hover:text-primary">
                                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminTrackingPage;