import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, Loader2, Receipt } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

const InvoiceDownloadModal = ({ isOpen, onClose, shipment }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!shipment) return null;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-document-content');
    if (!element) {
      toast.error('Document content not found');
      return;
    }

    try {
      setIsGenerating(true);
      toast.info('Generating Invoice PDF...', { id: 'pdf-gen' });
      
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
      pdf.save(`INV_${shipment.tracking_number}.pdf`);
      toast.success('Invoice downloaded successfully', { id: 'pdf-gen' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-gen' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById('invoice-document-content');
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

  const quantity = shipment.product_quantity || 1;
  const unitPrice = shipment.product_value || 0;
  const subtotal = quantity * unitPrice;
  const taxRate = 0.05; // 5% standard tax for example
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const invoiceDate = new Date(shipment.created);
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 30); // Net 30

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Commercial Invoice: {shipment.tracking_number}
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

        <div className="p-10 bg-white text-black" id="invoice-document-content">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter text-slate-900 mb-2">INVOICE</h1>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">US Box Mail Services</p>
                <p>123 Shipping Lane</p>
                <p>Logistics City, NY 10001</p>
                <p>contact@usboxmail.com</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 inline-block text-left min-w-[200px]">
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <span className="text-slate-500 font-medium">Invoice No:</span>
                  <span className="font-mono font-bold text-slate-900 text-right">{shipment.tracking_number}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <span className="text-slate-500 font-medium">Date:</span>
                  <span className="text-right">{invoiceDate.toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="text-slate-500 font-medium">Due Date:</span>
                  <span className="text-right font-medium">{dueDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-2">Bill To (Sender)</h3>
              <p className="font-bold text-lg text-slate-900">{shipment.sender_name || 'N/A'}</p>
              <p className="text-sm mt-1 text-slate-700">{shipment.sender_address || 'N/A'}</p>
              <p className="text-sm text-slate-700">
                {[shipment.sender_province, shipment.sender_country, shipment.sender_postal_code].filter(Boolean).join(', ')}
              </p>
              <p className="text-sm text-slate-600 mt-2">{shipment.sender_email || 'N/A'}</p>
              <p className="text-sm text-slate-600">{shipment.sender_contact || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-2">Ship To (Receiver)</h3>
              <p className="font-bold text-lg text-slate-900">{shipment.receiver_name || 'N/A'}</p>
              <p className="text-sm mt-1 text-slate-700">{shipment.receiver_address || 'N/A'}</p>
              <p className="text-sm text-slate-700">
                {[shipment.receiver_province, shipment.receiver_country, shipment.receiver_postal_code].filter(Boolean).join(', ')}
              </p>
              <p className="text-sm text-slate-600 mt-2">{shipment.receiver_email || 'N/A'}</p>
              <p className="text-sm text-slate-600">{shipment.receiver_contact || 'N/A'}</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 font-semibold rounded-tl-lg">Item Description</th>
                  <th className="p-3 font-semibold text-center">Qty</th>
                  <th className="p-3 font-semibold text-right">Unit Price</th>
                  <th className="p-3 font-semibold text-right rounded-tr-lg">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 border-b border-slate-300">
                <tr>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{shipment.product_name || 'N/A'}</p>
                    <p className="text-xs text-slate-500 mt-1">{shipment.product_description || 'No description provided'}</p>
                    <p className="text-xs text-slate-400 mt-1">Category: {shipment.product_category || 'General'}</p>
                  </td>
                  <td className="p-4 text-center font-medium">{quantity}</td>
                  <td className="p-4 text-right text-slate-700">${unitPrice.toFixed(2)}</td>
                  <td className="p-4 text-right font-medium text-slate-900">${subtotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-300 pt-3">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="border-t border-slate-200 pt-8">
            <h4 className="font-bold text-sm text-slate-800 mb-2">Payment Terms & Notes</h4>
            <p className="text-xs text-slate-600 mb-1">Please pay within 30 days of receiving this invoice.</p>
            <p className="text-xs text-slate-600 mb-1">Make all checks payable to US Box Mail Services.</p>
            <p className="text-xs text-slate-600">If you have any questions concerning this invoice, contact contact@usboxmail.com.</p>
            
            <div className="mt-8 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
              Thank you for your business!
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDownloadModal;