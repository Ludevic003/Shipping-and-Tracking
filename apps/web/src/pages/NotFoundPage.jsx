import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Search, Home, ArrowLeft, MapPin, ShieldCheck, 
  HelpCircle, Phone, Mail, Clock, Package, 
  Info, DollarSign, AlertCircle, Navigation
} from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const faqs = [
    { q: "How do I track my shipment?", a: "You can track your shipment by entering your tracking number on our homepage or the dedicated tracking page." },
    { q: "What is your insurance coverage?", a: "We offer comprehensive insurance at 15% of the declared value (100% for live animals), covering loss, theft, and damage." },
    { q: "How much does shipping cost?", a: "Shipping costs vary based on weight, dimensions, destination, and service level. Contact us for a detailed quote." },
    { q: "Do you ship live animals?", a: "Yes, we have specialized live animal shipping services with climate-controlled transit and expert handlers." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards, bank transfers, and select digital payment methods." },
    { q: "How long does delivery take?", a: "Express shipments take 2-5 business days, while standard shipping typically takes 7-14 business days depending on the destination." },
    { q: "What if my shipment is delayed?", a: "If your shipment is delayed beyond the estimated delivery date, please submit a complaint ticket through your client dashboard." },
    { q: "How do I submit a complaint?", a: "Log into your client dashboard, navigate to the specific shipment, and click 'Report Issue' to submit a detailed complaint." }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickLinks = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Info, label: "About Us", path: "/about" },
    { icon: Package, label: "Services", path: "/#services" },
    { icon: Navigation, label: "Tracking", path: "/#track" },
    { icon: ShieldCheck, label: "Insurance", path: "/insurance" },
    { icon: AlertCircle, label: "Live Animals", path: "/live-animal-shipping" },
    { icon: DollarSign, label: "Pricing", path: "/contact" },
    { icon: HelpCircle, label: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Page Not Found - US Box Mail Services</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-12 bg-secondary/30 border-b border-border/50 text-center px-4">
          <div className="container-custom max-w-3xl">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-3xl mb-8 rotate-3">
              <MapPin className="w-12 h-12 text-primary -rotate-3" />
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-foreground mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Looks like this package got lost in transit.
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's help you find what you need.
            </p>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for tracking, insurance, FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base bg-white shadow-sm rounded-xl"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full px-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => navigate('/')} className="rounded-full px-6">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Left Column: Quick Links & Contact */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-6">Quick Navigation</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {quickLinks.map((link, idx) => {
                      const Icon = link.icon;
                      return (
                        <Link 
                          key={idx} 
                          to={link.path}
                          className="flex flex-col items-center justify-center p-4 rounded-xl bg-secondary/30 hover:bg-primary/5 hover:text-primary transition-colors text-center group"
                        >
                          <Icon className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-sm font-medium">{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <Card className="border-border/50 shadow-sm bg-foreground text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <CardContent className="p-6 relative z-10">
                    <h3 className="text-xl font-bold mb-6">Need Support?</h3>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-white/60 mb-0.5">Call Us</p>
                          <p className="font-medium">+1 (310) 913-1570</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-white/60 mb-0.5">Email Us</p>
                          <p className="font-medium">support@usboxmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-white/60 mb-0.5">Support Hours</p>
                          <p className="font-medium">24/7 Global Support</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" className="w-full bg-white text-foreground hover:bg-white/90" onClick={() => navigate('/contact')}>
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: FAQs */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h3>
                  </div>

                  {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {filteredFaqs.map((faq, idx) => (
                        <AccordionItem key={idx} value={`faq-${idx}`} className="border border-border/50 rounded-xl px-6 bg-secondary/10">
                          <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-4">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground">No FAQs found</p>
                      <p className="text-muted-foreground">Try adjusting your search terms or contact support.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;