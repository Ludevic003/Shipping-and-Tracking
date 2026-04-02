import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Privacy Policy - US Box Mail Services</title>
        <meta name="description" content="Read the Privacy Policy for US Box Mail Services. Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="pt-24 pb-16 bg-white border-b border-border/50">
          <div className="container-custom max-w-4xl">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last Updated: March 14, 2026
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container-custom max-w-4xl">
            <div className="space-y-12 text-muted-foreground leading-relaxed text-lg">
              
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction and Privacy Commitment</h2>
                <p className="mb-4">
                  At US Box Mail Services ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our website, logistics services, and mail forwarding solutions.
                </p>
                <p>
                  By accessing our services, you agree to the collection and use of information in accordance with this policy. We adhere to strict international data protection standards to ensure your information remains confidential and secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Information Collection</h2>
                <p className="mb-4">We collect several types of information to provide and improve our services to you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, and physical address provided during account registration or contact inquiries.</li>
                  <li><strong className="text-foreground">Shipment Information:</strong> Sender and receiver details, package contents, declared values, and tracking numbers necessary for logistics operations.</li>
                  <li><strong className="text-foreground">Payment Information:</strong> Billing addresses and payment details (processed securely through our third-party payment gateways; we do not store full credit card numbers).</li>
                  <li><strong className="text-foreground">Usage Data:</strong> Information on how you interact with our website, including IP addresses, browser types, pages visited, and time spent on the site.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Usage</h2>
                <p className="mb-4">The information we collect is used for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To process, fulfill, and track your international and domestic shipments.</li>
                  <li>To communicate with you regarding your account, shipments, and customer service inquiries.</li>
                  <li>To process payments and prevent fraudulent transactions.</li>
                  <li>To comply with international customs regulations and legal requirements.</li>
                  <li>To improve our website functionality, service offerings, and user experience.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security Measures</h2>
                <p>
                  We implement robust, industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption for data transmission, secure server hosting, regular security audits, and restricted access to personal data by authorized personnel only. While we strive to use commercially acceptable means to protect your data, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Cookies and Tracking Technologies</h2>
                <p>
                  Our website uses cookies and similar tracking technologies to track activity and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service effectively.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Third-Party Sharing</h2>
                <p className="mb-4">We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Service Providers:</strong> With trusted carrier partners (e.g., DHL, FedEx), customs brokers, and payment processors necessary to fulfill our services.</li>
                  <li><strong className="text-foreground">Legal Compliance:</strong> When required by law, subpoena, or other legal processes, or to protect the rights, property, or safety of US Box Mail Services, our users, or others.</li>
                  <li><strong className="text-foreground">Business Transfers:</strong> In connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. User Rights and Choices</h2>
                <p className="mb-4">Depending on your location, you may have certain rights regarding your personal data, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The right to access, update, or delete the information we have on you.</li>
                  <li>The right of rectification if your information is inaccurate or incomplete.</li>
                  <li>The right to object to our processing of your personal data.</li>
                  <li>The right to request that we restrict the processing of your personal information.</li>
                  <li>The right to data portability.</li>
                </ul>
                <p className="mt-4">To exercise any of these rights, please contact our privacy team using the information provided below.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Data Retention Policies</h2>
                <p>
                  We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations (for example, customs and tax records), resolve disputes, and enforce our legal agreements and policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact Information</h2>
                <p className="mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at:
                </p>
                <div className="bg-secondary/50 p-6 rounded-xl border border-border/50 inline-block contain-layout">
                  <p><strong className="text-foreground">Email:</strong> privacy@usboxmail.com</p>
                  <p><strong className="text-foreground">Phone:</strong> +1 (310) 913-1570</p>
                  <p><strong className="text-foreground">Address:</strong> 100 Logistics Way, Suite 500, Los Angeles, CA 90001, USA</p>
                </div>
              </section>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;