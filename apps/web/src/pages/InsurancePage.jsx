import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Calculator, AlertCircle, FileText, CheckCircle2, DollarSign, Clock, XCircle, HelpCircle, Package } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const InsurancePage = () => {
  const [shipmentValue, setShipmentValue] = useState('');
  const [shipmentType, setShipmentType] = useState('regular');
  
  const value = parseFloat(shipmentValue) || 0;
  const insuranceRate = shipmentType === 'live_animal' ? 1.00 : 0.15;
  const insuranceCost = value * insuranceRate;
  const totalCost = value + insuranceCost;

  return (
    <div className="min-h-screen flex flex-col bg-background w-full overflow-x-hidden">
      <Helmet>
        <title>Insurance Policy - US Box Mail Services</title>
        <meta name="description" content="Learn about our comprehensive shipping insurance policy. Calculate your coverage costs and understand our claims process." />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-white border-b border-border/50">
          <div className="container-custom max-w-4xl text-center mobile-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Comprehensive <span className="text-primary">Shipping Insurance</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0">
              Protect your valuable shipments against loss, damage, or theft during transit. Our transparent insurance policy gives you complete peace of mind.
            </p>
            <p className="text-sm text-muted-foreground mt-6">Last Updated: March 14, 2026</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Main Content */}
              <div className="lg:col-span-7 space-y-12 md:space-y-16">
                
                {/* Overview and Benefits */}
                <div className="mobile-center">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                    <Shield className="w-6 h-6 text-primary shrink-0" />
                    Insurance Overview & Benefits
                  </h2>
                  <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-4">
                    <p>
                      International shipping involves multiple touchpoints, customs clearances, and varying transit conditions. While we maintain a 99.9% safe delivery rate, unpredictable circumstances can occur. US Box Mail Services offers a robust insurance program designed to protect your financial investment.
                    </p>
                    <p>
                      <strong>Key Benefits:</strong> Guaranteed reimbursement for lost or damaged goods, priority claims processing, dedicated support agents, and coverage that extends from our warehouse to your final delivery destination.
                    </p>
                  </div>
                </div>

                {/* Coverage Details */}
                <div className="mobile-center">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    Coverage Details & Limits
                  </h2>
                  <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-4 text-left">
                    <p>
                      Our insurance policy covers the declared value of your goods up to a maximum limit of <strong>$50,000 USD per shipment</strong>. The coverage applies to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li><strong>Physical Damage:</strong> Coverage for items damaged during transit due to mishandling, accidents, or environmental exposure.</li>
                      <li><strong>Total Loss:</strong> Full reimbursement if the package is lost in transit and cannot be located within 30 days of the estimated delivery date.</li>
                      <li><strong>Theft:</strong> Protection against stolen packages before confirmed delivery at the destination address.</li>
                      <li><strong>Concealed Damage:</strong> Damage discovered upon opening the package (must be reported within 48 hours of delivery).</li>
                    </ul>
                  </div>
                </div>

                {/* Calculation Explanation */}
                <div className="mobile-center">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                    <Calculator className="w-6 h-6 text-primary shrink-0" />
                    Insurance Calculation Method
                  </h2>
                  <div className="bg-secondary/50 p-6 rounded-2xl border border-border/50 w-full text-left contain-layout">
                    <p className="text-lg text-foreground font-medium mb-4">Transparent Flat Rates</p>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        We keep our insurance pricing simple and transparent based on the type of goods you are shipping:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Regular Shipments:</strong> Calculated at exactly <strong>15%</strong> above the total declared cost of goods. (e.g., $100 value = $15 premium).</li>
                        <li><strong>Live Animal Shipments:</strong> Calculated at exactly <strong>100%</strong> above the total declared cost of goods due to specialized handling requirements. (e.g., $100 value = $100 premium).</li>
                      </ul>
                      <p className="mt-4">
                        This premium ensures priority handling, specialized routing (for live animals), and expedited claims processing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Covered vs Not Covered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm contain-layout">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      What is Covered
                    </h3>
                    <ul className="space-y-3 text-muted-foreground text-sm md:text-base">
                      <li>✓ Electronics and accessories</li>
                      <li>✓ Clothing, apparel, and textiles</li>
                      <li>✓ Books and printed media</li>
                      <li>✓ Properly packaged fragile items</li>
                      <li>✓ Approved Live Animals (with 100% rate)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm contain-layout">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-destructive shrink-0" />
                      What is NOT Covered
                    </h3>
                    <ul className="space-y-3 text-muted-foreground text-sm md:text-base">
                      <li>✗ Cash or negotiable instruments</li>
                      <li>✗ Perishable foods</li>
                      <li>✗ Hazardous materials or explosives</li>
                      <li>✗ Items seized by customs</li>
                      <li>✗ Improperly packaged goods</li>
                    </ul>
                  </div>
                </div>

                {/* How to Purchase */}
                <div className="mobile-center">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                    <FileText className="w-6 h-6 text-primary shrink-0" />
                    How to Purchase Insurance
                  </h2>
                  <div className="space-y-4 w-full text-left">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">1</div>
                      <p className="text-base md:text-lg text-muted-foreground pt-0.5"><strong>Declare Value:</strong> Accurately declare the commercial value of your goods when creating a shipment request.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">2</div>
                      <p className="text-base md:text-lg text-muted-foreground pt-0.5"><strong>Select Option:</strong> Check the "Add Premium Insurance" box and select your shipment type (Regular or Live Animal).</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">3</div>
                      <p className="text-base md:text-lg text-muted-foreground pt-0.5"><strong>Pay Premium:</strong> The appropriate premium (15% or 100%) will be automatically calculated and added to your invoice.</p>
                    </div>
                  </div>
                </div>

                {/* Claims Process & Documentation */}
                <div className="mobile-center">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                    <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                    Claims Process & Required Documentation
                  </h2>
                  <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-4 text-left">
                    <p>
                      In the rare event of an issue, our claims process is designed to be swift and hassle-free. Claims must be initiated within <strong>48 hours</strong> of delivery for damaged goods, or within <strong>14 days</strong> of the estimated delivery date for lost packages.
                    </p>
                    <p className="font-medium text-foreground mt-6">Required Documentation:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Original commercial invoice or proof of purchase showing the item's value.</li>
                      <li>Clear, high-resolution photographs of the damaged item(s).</li>
                      <li>Clear photographs of the exterior and interior packaging (do not discard packaging until the claim is resolved).</li>
                      <li>A completed US Box Mail Services Claim Form.</li>
                    </ul>
                  </div>
                </div>

                {/* Timeline & Exclusions */}
                <div className="mobile-center">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                    <Clock className="w-6 h-6 text-primary shrink-0" />
                    Settlement Timeline & Exclusions
                  </h2>
                  <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-4 text-left">
                    <p>
                      <strong>Timeline:</strong> Once all required documentation is submitted, our team typically processes and resolves claims within <strong>7 to 10 business days</strong>. Approved claim payouts are credited to your original payment method or account balance.
                    </p>
                    <p>
                      <strong>Exclusions & Limitations:</strong> Insurance does not cover delays in transit, indirect or consequential losses (such as loss of profit or business opportunity), or damages resulting from acts of God, war, or government/customs interventions.
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mobile-center">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center justify-center md:justify-start gap-3 w-full">
                    <HelpCircle className="w-6 h-6 text-primary shrink-0" />
                    Insurance Inquiries
                  </h2>
                  <div className="bg-secondary/30 p-6 rounded-xl border border-border/50 w-full text-left contain-layout">
                    <p className="text-base md:text-lg text-muted-foreground mb-4">
                      Have questions about covering a specific high-value item or need help filing a claim? Contact our dedicated insurance team:
                    </p>
                    <p className="text-foreground font-medium">Email: insurance@usboxmail.com</p>
                    <p className="text-foreground font-medium">Phone: +1 (310) 913-1570 (Ext. 3)</p>
                  </div>
                </div>

              </div>

              {/* Sidebar - Calculator */}
              <div className="lg:col-span-5 mt-8 lg:mt-0">
                <div className="sticky top-24">
                  <Card className="border-border/50 shadow-lg contain-layout">
                    <CardHeader className="bg-secondary/30 border-b border-border/50 pb-6">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-primary shrink-0" />
                        Insurance Calculator
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Estimate your insurance premium instantly.
                      </p>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">
                          Shipment Type
                        </label>
                        <Select value={shipmentType} onValueChange={setShipmentType}>
                          <SelectTrigger className="h-12 bg-background min-h-[44px]">
                            <SelectValue placeholder="Select shipment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular Shipment (15% Rate)</SelectItem>
                            <SelectItem value="live_animal">Live Animal (100% Rate)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="value" className="text-sm font-medium text-foreground">
                          Declared Value of Goods (USD)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="value"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={shipmentValue}
                            onChange={(e) => setShipmentValue(e.target.value)}
                            className="pl-10 h-12 text-lg bg-background min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Goods Value:</span>
                          <span className="font-medium">${value.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Premium ({shipmentType === 'live_animal' ? '100%' : '15%'}):
                          </span>
                          <span className="font-medium text-primary">+ ${insuranceCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-border/50">
                          <span className="text-lg font-bold text-foreground">Total Insured Value:</span>
                          <span className="text-2xl font-bold text-foreground">${totalCost.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button className="w-full h-12 text-base mt-4 min-h-[48px]" onClick={() => window.location.href = '/contact'}>
                        Contact Us to Insure
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Help Mini-Card */}
                  <div className="mt-6 bg-white p-6 rounded-xl border border-border/50 shadow-sm contain-layout">
                    <h3 className="font-bold text-foreground mb-3">Need to file a claim?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ensure you have your tracking number and commercial invoice ready before contacting support.
                    </p>
                    <Button variant="outline" className="w-full min-h-[48px]" onClick={() => window.location.href = '/contact'}>
                      Start a Claim
                    </Button>
                  </div>
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

export default InsurancePage;