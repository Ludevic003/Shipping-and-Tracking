import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AlertCircle, ArrowLeft, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const ComplaintHistoryPage = () => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const records = await pb.collection('complaint_tickets').getFullList({
          filter: `user_email = "${currentUser.email}"`,
          expand: 'shipment_id',
          sort: '-created',
          $autoCancel: false
        });
        setComplaints(records);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchComplaints();
    }
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved':
      case 'Closed': return <CheckCircle2 className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>My Complaints - US Box Mail Services</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-5xl">
          <Link to="/dashboard/client" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complaint History</h1>
            <p className="text-muted-foreground">Track the status of your reported issues and support tickets.</p>
          </div>

          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden contain-layout">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="w-full h-24 rounded-xl" />
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">No complaints found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You haven't submitted any complaints or issues yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="p-6 hover:bg-secondary/10 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="outline" className={`flex items-center gap-1.5 ${getStatusColor(complaint.status)}`}>
                            {getStatusIcon(complaint.status)}
                            {complaint.status || 'Open'}
                          </Badge>
                          <span className="text-sm font-medium text-muted-foreground">
                            Ticket #{complaint.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {new Date(complaint.created).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-1">
                            {complaint.complaint_type} Issue
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Shipment: <Link to={`/shipments/${complaint.shipment_id}`} className="text-primary hover:underline font-medium">{complaint.expand?.shipment_id?.tracking_number || 'Unknown'}</Link>
                          </p>
                        </div>

                        <p className="text-sm text-foreground line-clamp-2 max-w-3xl">
                          {complaint.description}
                        </p>

                        {complaint.response_notes && (
                          <div className="mt-4 bg-secondary/30 p-4 rounded-lg border border-border/50">
                            <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Support Response</p>
                            <p className="text-sm text-muted-foreground">{complaint.response_notes}</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComplaintHistoryPage;