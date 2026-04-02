import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, Loader2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

const BLDownloadModal = ({ isOpen, onClose, shipment }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!shipment) return null;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('bl-document-content');
    if (!element) {
      toast.error('Document content not found');
      return;
    }

    try {
      setIsGenerating(true);
      toast.info('Generating Bill of Lading PDF...', { id: 'pdf-gen' });
      
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
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
      pdf.save(`BL_${shipment.tracking_number}.pdf`);
      toast.success('PDF downloaded successfully', { id: 'pdf-gen' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-gen' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById('bl-document-content');
    if (!element) return;
    
    try {
      const printContent = element.innerHTML;
      const originalContent = document.body.innerHTML;
      
      document.body.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif; background: white; color: black;">
          ${printContent}
        </div>
      `;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print document');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Bill of Lading: {shipment.tracking_number}
          </DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} disabled={isGenerating}>
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button size="sm" onClick={handleDownloadPDF} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </DialogHeader>

        <div className="p-8 bg-white text-black" id="bl-document-content">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase text-slate-900">Bill of Lading</h1>
              <p className="text-sm text-slate-600 mt-1 font-medium">US Box Mail Services</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Tracking Number</p>
              <p className="font-mono font-bold text-2xl text-slate-900">{shipment.tracking_number}</p>
              <p className="text-sm text-slate-600 mt-2">Date: {new Date(shipment.created).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="border border-slate-300 p-5 rounded-xl bg-slate-50/50">
              <h3 className="font-bold uppercase text-sm border-b border-slate-200 pb-2 mb-3 text-slate-800">Shipper / Sender</h3>
              <p className="font-bold text-lg text-slate-900">{shipment.sender_name || 'N/A'}</p>
              <p className="text-sm mt-2 text-slate-700">{shipment.sender_address || 'N/A'}</p>
              <p className="text-sm text-slate-700">
                {[shipment.sender_province, shipment.sender_country, shipment.sender_postal_code].filter(Boolean).join(', ')}
              </p>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-slate-600"><span className="font-medium">Phone:</span> {shipment.sender_contact || 'N/A'}</p>
                <p className="text-sm text-slate-600"><span className="font-medium">Email:</span> {shipment.sender_email || 'N/A'}</p>
              </div>
            </div>
            <div className="border border-slate-300 p-5 rounded-xl bg-slate-50/50">
              <h3 className="font-bold uppercase text-sm border-b border-slate-200 pb-2 mb-3 text-slate-800">Consignee / Receiver</h3>
              <p className="font-bold text-lg text-slate-900">{shipment.receiver_name || 'N/A'}</p>
              <p className="text-sm mt-2 text-slate-700">{shipment.receiver_address || 'N/A'}</p>
              <p className="text-sm text-slate-700">
                {[shipment.receiver_province, shipment.receiver_country, shipment.receiver_postal_code].filter(Boolean).join(', ')}
              </p>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-slate-600"><span className="font-medium">Phone:</span> {shipment.receiver_contact || 'N/A'}</p>
                <p className="text-sm text-slate-600"><span className="font-medium">Email:</span> {shipment.receiver_email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shipment Info */}
          <div className="mb-8 border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
              <h3 className="font-bold uppercase text-sm text-slate-800">Routing Information</h3>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              <div className="p-4">
                <p className="text-xs text-slate-500 uppercase mb-1">Origin</p>
                <p className="font-medium text-sm">{shipment.pickup_location || 'N/A'}</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 uppercase mb-1">Destination</p>
                <p className="font-medium text-sm">{shipment.destination_location || 'N/A'}</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 uppercase mb-1">Est. Delivery</p>
                <p className="font-medium text-sm">{shipment.estimated_delivery_date ? new Date(shipment.estimated_delivery_date).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mb-8">
            <h3 className="font-bold uppercase text-sm border-b-2 border-black pb-2 mb-4">Commodity Description</h3>
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-300">
                  <th className="p-3 font-semibold text-slate-800">Description</th>
                  <th className="p-3 font-semibold text-slate-800">Category</th>
                  <th className="p-3 font-semibold text-slate-800 text-center">Qty</th>
                  <th className="p-3 font-semibold text-slate-800 text-center">Weight (kg)</th>
                  <th className="p-3 font-semibold text-slate-800 text-center">Dimensions (cm)</th>
                  <th className="p-3 font-semibold text-slate-800 text-right">Declared Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 border-b border-slate-300">
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{shipment.product_name || 'N/A'}</p>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs">{shipment.product_description || ''}</p>
                  </td>
                  <td className="p-3 text-slate-700">{shipment.product_category || 'N/A'}</td>
                  <td className="p-3 text-center font-medium">{shipment.product_quantity || 1}</td>
                  <td className="p-3 text-center text-slate-700">{shipment.product_weight || 'N/A'}</td>
                  <td className="p-3 text-center text-slate-700">
                    {shipment.product_dimensions_length ? `${shipment.product_dimensions_length}x${shipment.product_dimensions_width}x${shipment.product_dimensions_height}` : 'N/A'}
                  </td>
                  <td className="p-3 text-right font-medium">${typeof shipment.product_value === 'number' ? shipment.product_value.toFixed(2) : '0.00'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer / Signatures */}
          <div className="grid grid-cols-2 gap-12 mt-16 pt-8 border-t border-slate-300">
            <div>
              <div className="border-b border-black w-full mb-2 h-10"></div>
              <p className="text-xs uppercase font-medium text-slate-600">Carrier Signature / Date</p>
            </div>
            <div>
              <div className="border-b border-black w-full mb-2 h-10"></div>
              <p className="text-xs uppercase font-medium text-slate-600">Receiver Signature / Date</p>
            </div>
          </div>
          
          <div className="mt-12 text-xs text-slate-500 text-center border-t border-slate-200 pt-6">
            <p className="mb-1">RECEIVED, subject to individually determined rates or contracts that have been agreed upon in writing between the carrier and shipper.</p>
            <p>Generated electronically on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BLDownloadModal;