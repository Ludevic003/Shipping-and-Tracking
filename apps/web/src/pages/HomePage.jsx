import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search, Globe2, Zap, ShieldCheck, MapPin, ArrowRight, PackageSearch, Truck, Clock, Headphones as HeadphonesIcon, Box, FileText, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PartnerSlider from '@/components/PartnerSlider.jsx';
import LazyImage from '@/components/LazyImage.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HomePage = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/tracking/${trackingNumber.trim()}`);
    }
  };

  const offices = [
    { city: 'Los Angeles, CA', region: 'Americas', desc: 'Our global headquarters and primary gateway for North and South American logistics.', phone: '+1 (310) 913-1570', email: 'la@usboxmail.com' },
    { city: 'Dubai', region: 'Middle East', desc: 'Strategic hub connecting East and West, offering premium forwarding services.', phone: '+971 4 555 0199', email: 'dubai@usboxmail.com' },
    { city: 'Bangkok', region: 'East Asia', desc: 'Central operations for the Asia-Pacific region with rapid regional distribution.', phone: '+66 99 374 9864', email: 'bangkok@usboxmail.com' },
    { city: 'Nairobi', region: 'Africa', desc: 'Expanding our reach across the African continent with reliable delivery networks.', phone: '+254 20 555 0199', email: 'nairobi@usboxmail.com' }
  ];

  const steps = [
    { icon: <Box className="w-6 h-6" />, title: 'Package Received', desc: 'Your items arrive at our secure global facilities.' },
    { icon: <FileText className="w-6 h-6" />, title: 'Processing & Customs', desc: 'We handle all documentation and clearance swiftly.' },
    { icon: <Globe2 className="w-6 h-6" />, title: 'International Transit', desc: 'Dispatched via our optimized global carrier network.' },
    { icon: <Truck className="w-6 h-6" />, title: 'Local Delivery', desc: 'Final mile delivery straight to your doorstep.' }
  ];

  const services = [
    { title: 'International Shipping', desc: 'Fast, reliable parcel delivery to over 150 countries worldwide.' },
    { title: 'Package Consolidation', desc: 'Combine multiple orders into one shipment to save up to 80% on shipping costs.' },
    { title: 'Customs Clearance', desc: 'Expert handling of all import/export documentation and duties.' },
    { title: 'Premium Insurance', desc: 'Comprehensive coverage for your valuable goods during transit.' }
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', location: 'London, UK', text: 'US Box Mail Services completely transformed how I shop from US stores. Fast, reliable, and the consolidation saved me a fortune.' },
    { name: 'Ahmed Al-Fayed', location: 'Dubai, UAE', text: 'As a business owner, I need logistics I can trust. Their Dubai hub ensures my inventory arrives on time, every time.' },
    { name: 'Elena Rodriguez', location: 'Madrid, Spain', text: 'The tracking system is incredibly accurate. I always know exactly where my packages are. Highly recommended!' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background w-full overflow-x-hidden">
      <Helmet>
        <title>US Box Mail Services - Global Logistics & Forwarding</title>
        <meta name="description" content="Premium global logistics, mail forwarding, and package tracking services. Offices in USA, UAE, Thailand, and Kenya." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1699549196390-e31bfc88536d)' }}
        >
          <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90"></div>
        </div>

        <div className="relative z-10 container-custom w-full pt-20 pb-32">
          <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-xs font-medium text-white tracking-wide uppercase">Global Logistics Network</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
              Borderless shipping, <span className="text-primary">delivered.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-12 max-w-2xl font-light">
              Experience seamless international mail forwarding and package delivery. Track your shipments in real-time across our global network.
            </p>

            <div id="track" className="bg-white p-2 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col sm:flex-row gap-2">
              <form onSubmit={handleTrack} className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                <div className="relative flex-1 w-full">
                  <PackageSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter tracking number..."
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 text-base border-0 focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-14 px-8 rounded-xl text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 w-full sm:w-auto"
                >
                  Track
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Global Offices Section */}
      <section className="section-padding bg-secondary/50 border-y border-border/50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Global Footprint</h2>
            <p className="text-lg text-muted-foreground">Strategic locations across four continents to serve you better.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, idx) => (
              <div key={idx} className="card-minimal p-6 md:p-8 flex flex-col h-full bg-white text-center sm:text-left items-center sm:items-start">
                <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full mb-6 gap-4 sm:gap-0">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {office.region}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{office.city}</h3>
                <p className="text-sm text-muted-foreground mb-8 flex-grow leading-relaxed">
                  {office.desc}
                </p>
                <div className="space-y-2 pt-6 border-t border-border/50 mt-auto w-full">
                  <p className="text-sm font-medium text-foreground">{office.phone}</p>
                  <p className="text-sm text-muted-foreground">{office.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">A streamlined process from our warehouse to your door.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border/50 -translate-y-1/2 z-0"></div>
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center bg-white p-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-lg shadow-primary/20 ring-4 ring-white">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm md:text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-foreground text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why choose US Box Mail Services?</h2>
              <p className="text-base md:text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
                We combine advanced technology with physical infrastructure to provide unparalleled shipping experiences. Our commitment to excellence ensures your packages are handled with the utmost care.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Reliability</h4>
                    <p className="text-sm text-white/60">99.9% on-time delivery rate across all global routes.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Speed</h4>
                    <p className="text-sm text-white/60">Optimized routing for the fastest possible transit times.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Globe2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Global Coverage</h4>
                    <p className="text-sm text-white/60">Delivering to over 150 countries with local expertise.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <HeadphonesIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">24/7 Support</h4>
                    <p className="text-sm text-white/60">Dedicated customer service team ready to assist you.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0 px-4 sm:px-0">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <LazyImage 
                  src="https://images.unsplash.com/photo-1699549196390-e31bfc88536d" 
                  alt="Warehouse operations" 
                  className="w-full h-full opacity-80"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 bg-white text-foreground p-4 sm:p-6 rounded-2xl shadow-xl max-w-[240px] sm:max-w-xs">
                <div className="flex items-center gap-3 sm:gap-4 mb-2">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" />
                  <span className="text-xl sm:text-2xl font-bold">10M+</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Packages successfully delivered worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comprehensive Services</h2>
            <p className="text-lg text-muted-foreground">Everything you need for seamless international logistics.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-white text-center sm:text-left contain-layout">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Agencies Slider */}
      <PartnerSlider />

      {/* Testimonials */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-muted-foreground">Don't just take our word for it. Here's what our customers say.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="bg-white border-border/50 shadow-sm text-center sm:text-left contain-layout">
                <CardContent className="p-6 md:p-8 flex flex-col h-full items-center sm:items-start">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-accent fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-8 flex-grow text-sm md:text-base">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Got questions? We've got answers.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-base md:text-lg font-medium">How long does international shipping take?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Delivery times vary depending on the destination and service level chosen. Express shipments typically arrive within 2-5 business days, while standard shipping can take 7-14 business days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-base md:text-lg font-medium">How is insurance calculated?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed">
                We offer comprehensive insurance at a flat rate of 15% of the declared value of your goods (50% for live animals). This covers loss, theft, and damage during transit. You can learn more on our Insurance Policy page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-base md:text-lg font-medium">Can I track my package in real-time?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Yes! Every shipment comes with a unique tracking number. You can enter this number on our homepage or tracking page to see real-time updates on your package's location and status.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-base md:text-lg font-medium">Do you handle customs clearance?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Absolutely. Our expert team handles all necessary customs documentation and clearance procedures to ensure your package moves smoothly across borders without unnecessary delays.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-base md:text-lg font-medium">What items are prohibited from shipping?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Prohibited items generally include hazardous materials, flammable liquids, explosives, illegal substances, and certain perishable goods. Please contact our support team for a detailed list specific to your destination country.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="bg-foreground rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to streamline your logistics?</h2>
              <p className="text-base md:text-lg text-white/70 mb-10">
                Partner with US Box Mail Services for reliable, transparent, and fast global shipping solutions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base" onClick={() => navigate('/contact')}>
                  Start Shipping Now
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white" onClick={() => navigate('/about')}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;