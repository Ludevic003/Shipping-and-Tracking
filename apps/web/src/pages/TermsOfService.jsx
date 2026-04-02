import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Terms of Service - US Box Mail Services</title>
        <meta name="description" content="Read the Terms of Service for US Box Mail Services. Understand the rules, guidelines, and agreements for using our logistics platform." />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="pt-24 pb-16 bg-white border-b border-border/50">
          <div className="container-custom max-w-4xl">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Terms of Service
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
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using the services provided by US Box Mail Services ("Company," "we," "us," or "our"), including our website, mail forwarding, and logistics solutions, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services. These terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License and Restrictions</h2>
                <p className="mb-4">
                  Permission is granted to temporarily access the materials and services on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Modify or copy the materials;</li>
                  <li>Use the materials for any commercial purpose or public display;</li>
                  <li>Attempt to decompile or reverse engineer any software contained on our website;</li>
                  <li>Remove any copyright or other proprietary notations from the materials; or</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. User Responsibilities</h2>
                <p className="mb-4">As a user of our logistics and forwarding services, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information regarding your identity, shipping addresses, and package contents.</li>
                  <li>Ensure that all items shipped through our service comply with the import/export laws of both the origin and destination countries.</li>
                  <li>Pay all applicable shipping fees, customs duties, taxes, and insurance premiums associated with your shipments.</li>
                  <li>Maintain the confidentiality of your account credentials and take responsibility for all activities that occur under your account.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Prohibited Activities and Items</h2>
                <p className="mb-4">You are strictly prohibited from using our services to ship, store, or handle:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Illegal drugs, narcotics, or controlled substances.</li>
                  <li>Firearms, weaponry, ammunition, or explosive materials.</li>
                  <li>Hazardous, combustible, or toxic materials.</li>
                  <li>Counterfeit goods, pirated materials, or items that infringe on intellectual property rights.</li>
                  <li>Live animals, human remains, or perishable goods not explicitly approved by our team.</li>
                </ul>
                <p className="mt-4">We reserve the right to inspect any package and refuse service, dispose of, or hand over to law enforcement any prohibited items without compensation.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Disclaimer of Warranties</h2>
                <p>
                  Our services are provided on an "as is" and "as available" basis. US Box Mail Services makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
                <p>
                  In no event shall US Box Mail Services, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Indemnification</h2>
                <p>
                  You agree to defend, indemnify and hold harmless US Box Mail Services and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, or b) a breach of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Intellectual Property Rights</h2>
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of US Box Mail Services and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of US Box Mail Services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Termination of Service</h2>
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Modifications to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law and Jurisdiction</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Information</h2>
                <p className="mb-4">
                  If you have any questions about these Terms, please contact our legal department:
                </p>
                <div className="bg-secondary/50 p-6 rounded-xl border border-border/50 inline-block contain-layout">
                  <p><strong className="text-foreground">Email:</strong> legal@usboxmail.com</p>
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

export default TermsOfService;