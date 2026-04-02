import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Shield, CheckCircle2, AlertTriangle, Package, Clock, Thermometer, Info } from 'lucide-react';

const LiveAnimalShippingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background w-full overflow-x-hidden">
      <Helmet>
        <title>Live Animal Shipping Guidelines - US Box Mail Services</title>
        <meta name="description" content="Comprehensive guidelines for shipping live animals safely and securely with US Box Mail Services. Learn about packaging standards, coverage, and surcharges." />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1681783050350-6833746d717e)' }}
          >
            <div className="absolute inset-0 bg-slate-950/85 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90"></div>
          </div>

          <div className="relative z-10 container-custom max-w-4xl text-center mobile-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 mx-auto md:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-xs font-medium text-white tracking-wide uppercase">Specialized Logistics</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Live Animal <span className="text-primary">Shipping Guidelines</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto md:mx-0 font-light">
              Ensuring the safe, secure, and timely transport of live animals. Review our comprehensive standards and requirements before booking your shipment.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <div className="space-y-16">
              
              {/* 1. Eligible Shipments */}
              <div className="mobile-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                  <CheckCircle2 className="w-8 h-8 text-primary shrink-0" />
                  1. Eligible Shipments
                </h2>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm w-full text-left contain-layout">
                  <p className="text-base md:text-lg text-muted-foreground mb-4">
                    We accept the following live shipments within the United States only:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span> Non-venomous reptiles</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span> Amphibians</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span> Invertebrates</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span> Fish and Corals</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span> Live Plants</li>
                  </ul>
                  <div className="mt-6 p-4 bg-destructive/10 rounded-xl border border-destructive/20 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive-foreground font-medium">
                      Venomous species, mammals, and birds are strictly prohibited. International shipping of live animals is not currently supported.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Packaging Standards */}
              <div className="mobile-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                  <Package className="w-8 h-8 text-primary shrink-0" />
                  2. Live Animal Packaging Standards
                </h2>
                <div className="space-y-6 w-full text-left">
                  <p className="text-base md:text-lg text-muted-foreground">
                    Strict adherence to packaging standards is required to ensure the safety of the animals and compliance with carrier regulations.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-secondary/30 p-6 rounded-xl border border-border/50 contain-layout">
                      <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Shipping Schedule
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• <strong>Reptiles/Amphibians:</strong> Overnight shipping ONLY.</li>
                        <li>• <strong>Invertebrates/Aquatics/Plants:</strong> 2-Day shipping permitted.</li>
                        <li>• <strong>Allowed Days:</strong> Monday, Tuesday, Wednesday, Thursday.</li>
                        <li>• <strong>Restrictions:</strong> No shipping on Fridays, weekends, or major holidays. Weather embargoes may apply.</li>
                      </ul>
                    </div>

                    <div className="bg-secondary/30 p-6 rounded-xl border border-border/50 contain-layout">
                      <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-primary" />
                        Temperature Control
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• <strong>Safe Range:</strong> 35°F to 95°F at origin, hubs, and destination.</li>
                        <li>• <strong>Insulation:</strong> Minimum ½" foam insulation required (¾" recommended).</li>
                        <li>• <strong>Packs:</strong> Use appropriate heat or cold packs based on weather. Packs must not directly touch the animal container.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-border/50 shadow-sm contain-layout">
                    <h3 className="font-bold text-foreground mb-4">Box & Labeling Requirements</h3>
                    <ul className="space-y-3 text-muted-foreground text-sm md:text-base">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong>Box Specs:</strong> Must use new, certified packaging (200 lbs burst strength). No reused or branded boxes (e.g., Amazon, liquor boxes). Must be clean, leak-proof, and escape-proof.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong>Ventilation:</strong> Adequate ventilation holes must be punched through both the cardboard and foam insulation.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong>Required Labels:</strong> 'LIVE ANIMAL(S)' and 'This Side Up' indicators must be clearly visible.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong>Lacey Act/IATA Compliance:</strong> Exterior must list common names, scientific names, and exact quantities of all animals inside.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Dimensions & Surcharges */}
              <div className="mobile-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                  <Info className="w-8 h-8 text-primary shrink-0" />
                  3. Package Dimensions & Surcharges
                </h2>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm w-full text-left contain-layout">
                  <p className="text-base md:text-lg text-muted-foreground mb-6">
                    Carriers impose strict limits and surcharges for oversized or heavy packages. Measure carefully, including any bulges in the box.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Maximum Limits</h4>
                      <p className="text-muted-foreground">Weight: 150 lbs max. Length: 119" max. Combined Length + Girth: 165" max.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Oversize Surcharges (Estimates)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                          <thead>
                            <tr className="border-b border-border/50">
                              <th className="py-3 font-semibold text-foreground">Service Type</th>
                              <th className="py-3 font-semibold text-foreground">Estimated Surcharge</th>
                            </tr>
                          </thead>
                          <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50">
                              <td className="py-3">Express / Ground</td>
                              <td className="py-3">$160.00 - $205.00</td>
                            </tr>
                            <tr className="border-b border-border/50">
                              <td className="py-3">Home Delivery</td>
                              <td className="py-3">$190.00 - $240.00</td>
                            </tr>
                            <tr>
                              <td className="py-3">Peak Holiday Surcharge</td>
                              <td className="py-3">Additional $39.50</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Live Arrival Coverage */}
              <div className="mobile-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                  <Shield className="w-8 h-8 text-primary shrink-0" />
                  4. Live Arrival Coverage
                </h2>
                <div className="space-y-4 w-full text-left text-muted-foreground text-base md:text-lg leading-relaxed">
                  <p>
                    We offer specialized insurance for live animal shipments at a rate of <strong>100% of the declared value</strong>. This covers the cost of the animal in the event of a Dead on Arrival (DOA) situation caused by carrier delays or mishandling.
                  </p>
                  <p>
                    <strong>Requirements for Coverage:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The package must be delivered <strong>at least 1 minute late</strong> past the guaranteed delivery commitment time.</li>
                    <li>All packaging standards (temperature, insulation, labeling) must have been strictly followed.</li>
                    <li>DOA claims must be reported with photographic evidence within 4 hours of delivery.</li>
                  </ul>
                  <div className="bg-secondary/30 p-4 rounded-xl border border-border/50 mt-4 space-y-4 contain-layout">
                    <p className="font-medium text-foreground mb-2">Coverage Examples (100% Rate):</p>
                    <div className="space-y-3 text-sm">
                      <div className="pb-3 border-b border-border/50">
                        <p className="font-semibold text-foreground">Example 1</p>
                        <p>Animal Value: $450.00 + Shipping: $50.00 = <strong className="text-primary">$500.00 Total Coverage (100%)</strong></p>
                      </div>
                      <div className="pb-3 border-b border-border/50">
                        <p className="font-semibold text-foreground">Example 2</p>
                        <p>Animal Value: $400.00 + Shipping: $50.00 = <strong className="text-primary">$450.00 Total Coverage (100%)</strong></p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Example 3</p>
                        <p>Animal Value: $50.00 + Shipping: $50.00 = <strong className="text-primary">$100.00 Total Coverage (100%)</strong></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Late Arrival Coverage */}
              <div className="mobile-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                  <Clock className="w-8 h-8 text-primary shrink-0" />
                  5. Late Arrival Coverage
                </h2>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm w-full text-left contain-layout">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                    Effective Date: 04/15/2025
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground mb-4">
                    If your live animal shipment arrives late, you may be eligible for a refund of the shipping costs (excluding insurance premiums).
                  </p>
                  <ul className="space-y-3 text-muted-foreground text-sm md:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong>Eligibility:</strong> Package must arrive ≥1 minute past the carrier's guaranteed delivery time.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong>Refund Details:</strong> Covers the base shipping rate. Does not cover the 100% live animal insurance premium or packaging costs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong>Exceptions:</strong> Delays caused by weather embargoes, acts of God, or incorrect address information provided by the sender void the late arrival guarantee.</span>
                    </li>
                  </ul>
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

export default LiveAnimalShippingPage;