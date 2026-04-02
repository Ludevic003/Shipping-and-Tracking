import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Phone, MapPin, Send, Clock, Building, Loader2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [selectedOffice, setSelectedOffice] = useState('usa');
  const [loading, setLoading] = useState(false);

  const offices = {
    usa: {
      name: 'Los Angeles, USA',
      region: 'Americas Operations',
      address: '100 Logistics Way, Suite 500, Los Angeles, CA 90001, USA',
      phone: '+1 (310) 913-1570',
      email: 'la@usboxmail.com',
      hours: 'Mon-Fri: 8:00 AM - 6:00 PM PST'
    },
    dubai: {
      name: 'Dubai, UAE',
      region: 'Middle East Operations',
      address: 'Logistics District, Building 4, Dubai South, UAE',
      phone: '+971 4 555 0199',
      email: 'dubai@usboxmail.com',
      hours: 'Sun-Thu: 9:00 AM - 6:00 PM GST'
    },
    bangkok: {
      name: 'Bangkok, Thailand',
      region: 'East Asia Operations',
      address: '88 Bangna-Trad Road, Bangna, Bangkok 10260, Thailand',
      phone: '+66 99 374 9864',
      email: 'bangkok@usboxmail.com',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM ICT'
    },
    nairobi: {
      name: 'Nairobi, Kenya',
      region: 'Africa Operations',
      address: 'Mombasa Road, Logistics Park Unit 12, Nairobi, Kenya',
      phone: '+254 20 555 0199',
      email: 'nairobi@usboxmail.com',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM EAT'
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const officeName = offices[selectedOffice].name;
      
      const submissionData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        office_location: officeName,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: 'New'
      };

      await pb.collection('contact_messages').create(submissionData, { $autoCancel: false });

      toast.success('Message sent successfully! Our team will contact you shortly.');
      
      // Reset form
      setFormData({ full_name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact submission error:', error);
      toast.error(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const activeOffice = offices[selectedOffice];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Contact Us - US Box Mail Services</title>
        <meta name="description" content="Contact US Box Mail Services. Reach out to our offices in Los Angeles, Dubai, Bangkok, or Nairobi." />
      </Helmet>

      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">How can we help?</h1>
            <p className="text-lg text-muted-foreground">
              Select your regional office below and send us a message. Our logistics experts are ready to assist you with tracking, enterprise solutions, or general inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="card-minimal p-8 md:p-10 bg-white contain-layout">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="space-y-2">
                    <Label htmlFor="office">Direct inquiry to</Label>
                    <Select value={selectedOffice} onValueChange={setSelectedOffice} disabled={loading}>
                      <SelectTrigger className="h-12 bg-background min-h-[44px]">
                        <SelectValue placeholder="Select an office" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usa">Los Angeles, USA (Americas)</SelectItem>
                        <SelectItem value="dubai">Dubai, UAE (Middle East)</SelectItem>
                        <SelectItem value="bangkok">Bangkok, Thailand (East Asia)</SelectItem>
                        <SelectItem value="nairobi">Nairobi, Kenya (Africa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        placeholder="John Doe"
                        value={formData.full_name}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="h-12 bg-background min-h-[44px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="h-12 bg-background min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Tracking inquiry, Enterprise quote..."
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="h-12 bg-background min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="min-h-[160px] resize-y bg-background p-4"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto h-12 px-8 rounded-lg min-h-[48px] transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Office Details Display */}
            <div className="lg:col-span-5">
              <div className="sticky top-32">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Selected Office Details</h3>
                
                <div className="card-minimal p-8 bg-secondary/30 border-none contain-layout">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">{activeOffice.name}</h4>
                      <p className="text-sm text-primary font-medium">{activeOffice.region}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Address</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{activeOffice.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Phone</p>
                        <p className="text-sm text-muted-foreground">{activeOffice.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Email</p>
                        <p className="text-sm text-muted-foreground">{activeOffice.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Operating Hours</p>
                        <p className="text-sm text-muted-foreground">{activeOffice.hours}</p>
                      </div>
                    </div>
                  </div>
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

export default ContactUs;