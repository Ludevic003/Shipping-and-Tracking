import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Save, User, Package, FileText, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const ComplaintManagementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [status, setStatus] = useState('');
  const [responseNotes, setResponseNotes] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const record = await pb.collection('complaint_tickets').getOne(id, {
          expand: 'shipment_id',
          $autoCancel: false
        });
        setComplaint(record);
        setStatus(record.status || 'Open');
        setResponseNotes(record.response_notes || '');
      } catch (err) {
        console.error('Error fetching complaint:', err);
        toast.error('Failed to load complaint details.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await pb.collection('complaint_tickets').update(id, {
        status,
        response_notes: responseNotes
      }, { $autoCancel: false });
      
      setComplaint(updated);
      toast.success('Complaint updated successfully');
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 py-12 container-custom">
          <Skeleton className="w-32 h-10 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><Skeleton className="w-full h-96 rounded-2xl" /></div>
            <div><Skeleton className="w-full h-96 rounded-2xl" /></div>
          </div>
        </main>
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Manage Complaint #{complaint.id.slice(0,8)} - Admin</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-8">
        <div className="container-custom max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="-ml-4 text-slate-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-white border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Complaint Details</CardTitle>
                    <Badge variant="secondary">{complaint.complaint_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{complaint.subject}</h3>
                    <p className="text-sm text-slate-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      Submitted: {new Date(complaint.created).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Description</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 whitespace-pre-wrap">
                      {complaint.description}
                    </div>
                  </div>

                  {complaint.preferred_resolution && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">Preferred Resolution</p>
                      <p className="text-slate-700">{complaint.preferred_resolution}</p>
                    </div>
                  )}

                  {complaint.attachments && complaint.attachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">Attachments</p>
                      <div className="flex flex-wrap gap-3">
                        {complaint.attachments.map((file, idx) => (
                          <a 
                            key={idx} 
                            href={pb.files.getUrl(complaint, file)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            Attachment {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {complaint.expand?.shipment_id && (
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="bg-white border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-indigo-600" />
                      Linked Shipment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Tracking Number</p>
                      <p className="font-bold text-slate-900">{complaint.expand.shipment_id.tracking_number}</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate(`/admin/shipments/${complaint.expand.shipment_id.id}/edit`)}>
                      Manage Shipment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Admin Controls */}
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-white border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    User Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                    <p className="text-slate-900 font-medium">{complaint.user_email}</p>
                  </div>
                  {complaint.phone && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">Phone</p>
                      <p className="text-slate-900">{complaint.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-indigo-200 shadow-sm bg-indigo-50/30">
                <CardHeader className="border-b border-indigo-100 pb-4">
                  <CardTitle className="text-lg text-indigo-900">Resolution & Status</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="status">Ticket Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response_notes">Admin Response Notes</Label>
                    <Textarea 
                      id="response_notes"
                      value={responseNotes}
                      onChange={(e) => setResponseNotes(e.target.value)}
                      placeholder="Enter response or internal notes here. This will be visible to the user."
                      rows={6}
                      className="bg-white resize-none"
                    />
                    <p className="text-xs text-slate-500">These notes are visible to the client on their dashboard.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintManagementPage;