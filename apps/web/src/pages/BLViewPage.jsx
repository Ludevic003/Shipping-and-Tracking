import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Printer, Download, ArrowLeft, FileText } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BLViewPage = () => {
  const { bl_number } = useParams();
  const [blData, setBlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBL = async () => {
      try {
        const record = await pb.collection('bill_of_lading').getFirstListItem(`bl_number="${bl_number}"`, {
          $autoCancel: false
        });
        setBlData(record);
      } catch (err) {
        setError('Bill of Lading not found or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    if (bl_number) fetchBL();
  }, [bl_number]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('bl-document-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${blData.bl_number}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('bl-document-content').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        ${printContent}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Bill of Lading {bl_number} - US Box</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/dashboard/client" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
            
            {blData && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
                <Button onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </div>
            )}
          </div>

          {loading && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/50">
              <Skeleton className="w-1/3 h-10 mb-8" />
              <div className="grid grid-cols-2 gap-8 mb-8">
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-32" />
              </div>
              <Skeleton className="w-full h-48" />
            </div>
          )}

          {error && !loading && (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-border/50 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Document Not Found</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {blData && !loading && (
            <div className="bg-white shadow-lg border border-border/50 rounded-xl overflow-hidden">
              <div className="p-8 md:p-12 text-black" id="bl-document-content">
                {/* BL Document Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tighter uppercase">Bill of Lading</h1>
                    <p className="text-sm text-gray-600 mt-1">US Box Mail Services</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{blData.bl_number}</p>
                    <p className="text-sm">Tracking: {blData.tracking_number}</p>
                    <p className="text-sm">Date: {new Date(blData.created).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="border border-gray-300 p-4 rounded-lg">
                    <h3 className="font-bold uppercase text-sm border-b border-gray-200 pb-2 mb-3">Shipper / Sender</h3>
                    <p className="font-semibold">{blData.sender_name}</p>
                    <p className="text-sm mt-1">{blData.sender_address}</p>
                    <p className="text-sm">{blData.sender_city}, {blData.sender_country}</p>
                    <p className="text-sm mt-2">Phone: {blData.sender_phone}</p>
                    <p className="text-sm">Email: {blData.sender_email}</p>
                  </div>
                  <div className="border border-gray-300 p-4 rounded-lg">
                    <h3 className="font-bold uppercase text-sm border-b border-gray-200 pb-2 mb-3">Consignee / Receiver</h3>
                    <p className="font-semibold">{blData.receiver_name}</p>
                    <p className="text-sm mt-1">{blData.receiver_address}</p>
                    <p className="text-sm">{blData.receiver_city}, {blData.receiver_country}</p>
                    <p className="text-sm mt-2">Phone: {blData.receiver_phone}</p>
                    <p className="text-sm">Email: {blData.receiver_email}</p>
                  </div>
                </div>

                {/* Product Details */}
                <div className="mb-8">
                  <h3 className="font-bold uppercase text-sm border-b-2 border-black pb-2 mb-4">Shipment Details</h3>
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Description</th>
                        <th className="border border-gray-300 p-2">Category</th>
                        <th className="border border-gray-300 p-2 text-center">Qty</th>
                        <th className="border border-gray-300 p-2 text-center">Weight (kg)</th>
                        <th className="border border-gray-300 p-2 text-center">Dimensions</th>
                        <th className="border border-gray-300 p-2 text-right">Declared Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">
                          <p className="font-semibold">{blData.product_name}</p>
                          <p className="text-xs text-gray-600">{blData.product_description}</p>
                        </td>
                        <td className="border border-gray-300 p-2">{blData.product_category}</td>
                        <td className="border border-gray-300 p-2 text-center">{blData.product_quantity}</td>
                        <td className="border border-gray-300 p-2 text-center">{blData.product_weight}</td>
                        <td className="border border-gray-300 p-2 text-center">{blData.product_dimensions}</td>
                        <td className="border border-gray-300 p-2 text-right">${blData.product_value?.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer / Signatures */}
                <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t border-gray-300">
                  <div>
                    <div className="border-b border-black w-64 mb-2"></div>
                    <p className="text-xs uppercase">Carrier Signature / Date</p>
                  </div>
                  <div>
                    <div className="border-b border-black w-64 mb-2"></div>
                    <p className="text-xs uppercase">Receiver Signature / Date</p>
                  </div>
                </div>
                
                <div className="mt-12 text-xs text-gray-500 text-center">
                  <p>This Bill of Lading is subject to the standard terms and conditions of US Box Mail Services.</p>
                  <p>Generated electronically on {new Date(blData.created).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BLViewPage;