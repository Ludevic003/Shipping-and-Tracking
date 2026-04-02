import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Frequently Asked Questions - US Box Mail Services</title>
      </Helmet>

      <Header />

      <main className="flex-1">
        <section className="pt-24 pb-16 bg-white border-b border-border/50">
          <div className="container-custom max-w-3xl text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our shipping, tracking, and logistics services.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-custom max-w-3xl">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white border border-border/50 rounded-xl px-6">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-6">How long does international shipping take?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  Delivery times vary depending on the destination and service level chosen. Express shipments typically arrive within 2-5 business days, while standard shipping can take 7-14 business days.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white border border-border/50 rounded-xl px-6">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-6">How is insurance calculated?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  We offer comprehensive insurance at a flat rate of 15% of the declared value of your goods (100% for live animals). This covers loss, theft, and damage during transit. You can learn more on our Insurance Policy page.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white border border-border/50 rounded-xl px-6">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-6">Can I track my package in real-time?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  Yes! Every shipment comes with a unique tracking number. You can enter this number on our homepage or tracking page to see real-time updates on your package's location and status.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white border border-border/50 rounded-xl px-6">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-6">Do you handle customs clearance?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  Absolutely. Our expert team handles all necessary customs documentation and clearance procedures to ensure your package moves smoothly across borders without unnecessary delays.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-white border border-border/50 rounded-xl px-6">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-6">What items are prohibited from shipping?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  Prohibited items generally include hazardous materials, flammable liquids, explosives, illegal substances, and certain perishable goods. Please contact our support team for a detailed list specific to your destination country.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;