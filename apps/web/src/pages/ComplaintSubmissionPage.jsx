import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { MessageSquare as MessageSquareWarning, Package, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const ComplaintSubmissionPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userShipments, setUserShipments] = useState([]);
  const [mode, setMode] = useState('general'); // 'general' or 'parcel'

  const [formData, setFormData] = useState({
    email: currentUser?.email || '',
    phone: '',
    subject: '',
    complaint_type: '',
    description: '',
    preferred_resolution: '',
    shipment_id: '',
    tracking_number_manual: ''
  });

  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchShipments = async () => {
        try {
          const records = await pb.collection('shipments').getFullList({
            filter: `sender_id.sender_email = "${currentUser.email}" || receiver_id.receiver_email = "${currentUser.email}"`,
            $autoCancel: false
          });
          setUserShipments(records);
        } catch (error) {
          console.error('Error fetching shipments:', error);
        }
      };
      fetchShipments();
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = new FormData();
      submissionData.append('user_email', formData.email);
      submissionData.append('subject', formData.subject);
      submissionData.append('complaint_type', formData.complaint_type);
      
      let finalDescription = formData.description;
      if (mode === 'parcel' && !formData.shipment_id && formData.tracking_number_manual) {
        finalDescription = `[Tracking Number: ${formData.tracking_number_manual}]\n\n${finalDescription}`;
      }
      submissionData.append('description', finalDescription);
      
      if (formData.phone) submissionData.append('phone', formData.phone);
      if (formData.preferred_resolution) submissionData.append('preferred_resolution', formData.preferred_resolution);
      if (mode === 'parcel' && formData.shipment_id) submissionData.append('shipment_id', formData.shipment_id);
      
      submissionData.append('status', 'Open');

      files.forEach(file => {
        submissionData.append('attachments', file);
      });

      await pb.collection('complaint_tickets').create(submissionData, { $autoCancel: false });
      
      setSuccess(true);
      toast.success('Complaint submitted successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-8 shadow-lg border-0">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Complaint Received</h2>
            <p className="text-slate-500 mb-8">
              We have received your complaint and our support team will review it shortly. You will receive updates via email.
            </p>
            <div className="flex flex-col gap-3">
              {currentUser ? (
                <Button onClick={() => navigate('/dashboard/client')}>Return to Dashboard</Button>
              ) : (
                <Button onClick={() => navigate('/')}>Return to Home</Button>
              )}
              <Button variant="outline" onClick={() => { setSuccess(false); setFormData({...formData, subject: '', description: ''}); }}>
                Submit Another
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Submit a Complaint - US Box Mail Services</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How can we help?</h1>
            <p className="text-slate-500 max-w-xl mx-auto">
              We're sorry you experienced an issue. Please provide the details below so our team can resolve it as quickly as possible.
            </p>
          </div>

          <Tabs defaultValue="general" onValueChange={setMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="general" className="text-base py-3">
                <MessageSquareWarning className="w-4 h-4 mr-2" />
                General Complaint
              </TabsTrigger>
              <TabsTrigger value="parcel" className="text-base py-3">
                <Package className="w-4 h-4 mr-2" />
                Parcel-Specific
              </TabsTrigger>
            </TabsList>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-white border-b border-slate-100 pb-6">
                <CardTitle>{mode === 'general' ? 'General Inquiry or Issue' : 'Shipment Issue'}</CardTitle>
                <CardDescription>
                  {mode === 'general' 
                    ? 'For issues related to billing, service quality, or general inquiries.' 
                    : 'For issues regarding a specific package (delayed, damaged, or lost).'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        required 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        readOnly={!!currentUser}
                        className={currentUser ? "bg-slate-100" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {mode === 'parcel' && (
                    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-slate-900">Shipment Details</h3>
                      </div>
                      
                      {currentUser && userShipments.length > 0 ? (
                        <div className="space-y-2">
                          <Label htmlFor="shipment_id">Select Shipment <span className="text-red-500">*</span></Label>
                          <Select 
                            required={mode === 'parcel'} 
                            onValueChange={(val) => handleSelectChange('shipment_id', val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a recent shipment" />
                            </SelectTrigger>
                            <SelectContent>
                              {userShipments.map(shipment => (
                                <SelectItem key={shipment.id} value={shipment.id}>
                                  {shipment.tracking_number} - {shipment.status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="tracking_number_manual">Tracking Number <span className="text-red-500">*</span></Label>
                          <Input 
                            id="tracking_number_manual" 
                            name="tracking_number_manual" 
                            required={mode === 'parcel'}
                            value={formData.tracking_number_manual}
                            onChange={handleInputChange}
                            placeholder="Enter tracking number (e.g. USBX123456789)"
                          />
                          {!currentUser && (
                            <p className="text-xs text-slate-500 flex items-center mt-1">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Log in to automatically select from your shipments.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="complaint_type">Issue Type <span className="text-red-500">*</span></Label>
                    <Select 
                      required 
                      onValueChange={(val) => handleSelectChange('complaint_type', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of issue" />
                      </SelectTrigger>
                      <SelectContent>
                        {mode === 'general' ? (
                          <>
                            <SelectItem value="General">General Inquiry</SelectItem>
                            <SelectItem value="Service">Service Quality</SelectItem>
                            <SelectItem value="Billing">Billing & Payments</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="Delay">Delayed Shipment</SelectItem>
                            <SelectItem value="Damage">Damaged Package</SelectItem>
                            <SelectItem value="Lost Package">Lost Package</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      required 
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief summary of the issue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      required 
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please provide as much detail as possible..."
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_resolution">Preferred Resolution (Optional)</Label>
                    <Input 
                      id="preferred_resolution" 
                      name="preferred_resolution" 
                      value={formData.preferred_resolution}
                      onChange={handleInputChange}
                      placeholder="How would you like us to resolve this?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Attachments (Optional)</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        multiple 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                      
                      {files.length > 0 && (
                        <div className="mt-4 text-left">
                          <p className="text-xs font-semibold text-slate-700 mb-2">Selected files:</p>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {files.map((f, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                {f.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </Tabs>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComplaintSubmissionPage;