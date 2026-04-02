import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, MessageSquare as MessageSquareWarning, Clock, Package, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const record = await pb.collection('complaint_tickets').getOne(id, {
          expand: 'shipment_id',
          $autoCancel: false
        });
        setComplaint(record);
      } catch (err) {
        console.error('Error fetching complaint:', err);
        setError('Complaint not found or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Open': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 py-12 container-custom">
          <Skeleton className="w-32 h-10 mb-8" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 py-20 container-custom text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Complaint</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Button onClick={() => navigate('/dashboard/client')}>Return to Dashboard</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Complaint Details - US Box Mail Services</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-10">
        <div className="container-custom max-w-4xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">Ticket #{complaint.id.slice(0, 8).toUpperCase()}</h1>
                <Badge className={getStatusColor(complaint.status)}>{complaint.status || 'Open'}</Badge>
              </div>
              <p className="text-slate-500 flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                Submitted on {new Date(complaint.submitted_at || complaint.created).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-white border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareWarning className="w-5 h-5 text-indigo-600" />
                  Complaint Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Subject</p>
                    <p className="font-semibold text-slate-900">{complaint.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Category</p>
                    <Badge variant="secondary">{complaint.complaint_type}</Badge>
                  </div>
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
                <CardHeader className="bg-white border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    Linked Shipment
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Tracking Number</p>
                    <p className="font-bold text-slate-900">{complaint.expand.shipment_id.tracking_number}</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate(`/shipments/${complaint.expand.shipment_id.id}`)}>
                    View Shipment Details
                  </Button>
                </CardContent>
              </Card>
            )}

            {complaint.response_notes && (
              <Card className="border-indigo-200 shadow-sm bg-indigo-50/50">
                <CardHeader className="border-b border-indigo-100">
                  <CardTitle className="flex items-center gap-2 text-indigo-900">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    Support Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-slate-800 whitespace-pre-wrap">
                    {complaint.response_notes}
                  </div>
                  <p className="text-xs text-slate-500 mt-4">
                    Last updated: {new Date(complaint.updated).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComplaintDetailPage;