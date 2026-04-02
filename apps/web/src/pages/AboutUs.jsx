import React from 'react';
import { Helmet } from 'react-helmet';
import { Target, ShieldCheck, Globe2, Clock, MapPin, Phone, Mail, Building } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AboutUs = () => {
  const offices = [
    {
      city: 'Loss Angeles, California',
      region: 'Americas Operations',
      address: '13636 Mindanao Way Los Angeles, CA 90292 United States',
      phone: '+1 (310) 913‑1570',
      email: 'la@usboxmail.com',
      hours: 'Mon-Fri: 8:00 AM - 6:00 PM CST',
      services: 'Global Headquarters, North American Distribution, Enterprise Solutions'
    },
    {
      city: 'Dubai',
      region: 'Middle East Operations',
      address: 'Logistics District, Building 4, Dubai South, UAE',
      phone: '+971 4 555 0199',
      email: 'dubai@usboxmail.com',
      hours: 'Sun-Thu: 9:00 AM - 6:00 PM GST',
      services: 'Middle East Hub, Customs Clearance, Express Forwarding'
    },
    {
      city: 'Bangkok',
      region: 'East Asia Operations',
      address: '88 Bangna-Trad Road, Bangna, Bangkok 10260, Thailand',
      phone: '+66 2 555 0199',
      email: 'bangkok@usboxmail.com',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM ICT',
      services: 'Asia-Pacific Distribution, E-commerce Fulfillment'
    },
    {
      city: 'Nairobi',
      region: 'Africa Operations',
      address: 'Mombasa Road, Logistics Park Unit 12, Nairobi, Kenya',
      phone: '+254 20 555 0199',
      email: 'nairobi@usboxmail.com',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM EAT',
      services: 'African Continental Hub, Last-Mile Delivery'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>About Us - US Box Mail Services</title>
        <meta name="description" content="Learn about US Box Mail Services, our global presence, mission, and core values." />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Minimalist Hero */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-white border-b border-border/50">
          <div className="container-custom max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Connecting the world through <span className="text-primary">precision logistics.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              US Box Mail Services was founded on a simple principle: distance should never be a barrier. We provide seamless, secure, and rapid mail forwarding and logistics solutions across four continents.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5">
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  To empower global commerce and personal connections by delivering an unparalleled logistics experience. We strive to make international shipping as simple and reliable as sending a package next door.
                </p>
                <div className="w-20 h-1 bg-primary rounded-full"></div>
              </div>
              
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="card-minimal p-6 bg-white contain-layout">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Precision</h3>
                  <p className="text-muted-foreground">Exact routing, accurate tracking, and meticulous handling of every parcel.</p>
                </div>
                <div className="card-minimal p-6 bg-white contain-layout">
                  <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Security</h3>
                  <p className="text-muted-foreground">Military-grade protocols ensuring your shipments are protected at all times.</p>
                </div>
                <div className="card-minimal p-6 bg-white contain-layout">
                  <Globe2 className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Accessibility</h3>
                  <p className="text-muted-foreground">Breaking down geographical barriers with strategic global hubs.</p>
                </div>
                <div className="card-minimal p-6 bg-white contain-layout">
                  <Clock className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Reliability</h3>
                  <p className="text-muted-foreground">Consistent, on-time delivery you can count on, 365 days a year.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Presence - Detailed Offices */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Global Presence</h2>
              <p className="text-lg text-muted-foreground">
                Our strategically located offices ensure rapid processing and distribution across major global markets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {offices.map((office, idx) => (
                <div key={idx} className="card-minimal p-8 bg-white flex flex-col contain-layout">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                      <Building className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{office.city}</h3>
                      <p className="text-sm font-medium text-primary uppercase tracking-wider mt-1">{office.region}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5 flex-grow">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-foreground leading-relaxed">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                      <span className="text-foreground">{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                      <span className="text-foreground">{office.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                      <span className="text-foreground">{office.hours}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Key Services</p>
                    <p className="text-foreground">{office.services}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="section-padding bg-foreground text-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Built on trust and technology</h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Since our inception, US Box Mail Services has grown from a regional forwarder to a global logistics powerhouse. Our team of over 5,000 dedicated professionals works around the clock to ensure the smooth operation of our supply chain.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                By integrating proprietary tracking software with state-of-the-art warehousing facilities, we provide an unmatched level of transparency and efficiency for both individual consumers and enterprise clients.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;