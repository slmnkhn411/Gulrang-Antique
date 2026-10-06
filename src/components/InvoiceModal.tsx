import React from 'react';
import { X, Printer, Download, Sparkles, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { SupportedCurrency, formatCurrency } from '../utils/currency';
import { StoreService } from '../services/store';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  currency: SupportedCurrency;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
  currency
}) => {
  if (!isOpen || !order) return null;

  const settings = StoreService.getSettings();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity no-print" 
        onClick={onClose}
      />

      {/* Invoice Card */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#DFD1BD] z-10 p-6 sm:p-10 text-[#1C1917]">
        
        {/* Action Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-[#E7DFD3] mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#88672D]">
              Official Atelier Invoice Document
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1C1917] text-[#FAF7F2] text-xs font-medium rounded hover:bg-[#2C2723] transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area with ID for print CSS */}
        <div id="printable-invoice" className="space-y-6">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-[#1C1917] pb-6 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917]">
                  Heritage <span className="text-[#88672D] italic font-normal">&amp;</span> Elegance
                </span>
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#78716C]">
                {settings.tagline}
              </p>
              <div className="text-xs text-[#57534E] mt-3 space-y-0.5 font-light">
                <p>{settings.address}</p>
                <p>Phone: {settings.phone} • Email: {settings.email}</p>
                <p className="font-mono text-[11px]">NTN/Tax ID: 8291044-3 • STRN: 327787618201</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-2xl font-serif font-bold uppercase tracking-wider text-[#88672D] block">
                INVOICE
              </span>
              <p className="font-mono font-bold text-sm text-[#1C1917] mt-1">{order.invoiceNumber}</p>
              <p className="text-xs text-[#78716C] mt-1">Order Ref: {order.orderNumber}</p>
              <p className="text-xs text-[#78716C]">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F3ECE0] text-[#88672D]">
                Payment: {order.paymentStatus} ({order.paymentMethod.toUpperCase()})
              </div>
            </div>
          </div>

          {/* Billing & Shipping Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#57534E] py-2 border-b border-[#E7DFD3]">
            <div>
              <span className="font-bold text-[#1C1917] uppercase tracking-wider block mb-1">
                Billed &amp; Delivered To:
              </span>
              <p className="font-semibold text-[#1C1917] text-sm">{order.customerInfo.fullName}</p>
              <p>{order.customerInfo.address}</p>
              <p>{order.customerInfo.city}, {order.customerInfo.province} {order.customerInfo.postalCode}</p>
              <p>{order.customerInfo.country}</p>
              <p className="mt-1">Contact: {order.customerInfo.phone}</p>
              <p>Email: {order.customerInfo.email}</p>
            </div>

            <div className="sm:text-right">
              <span className="font-bold text-[#1C1917] uppercase tracking-wider block mb-1">
                Fulfillment &amp; Transit:
              </span>
              <p>Method: {order.shippingMethod.toUpperCase()} INSURED</p>
              <p>Carrier: {order.courier || 'TCS Express / Studio Logistics'}</p>
              <p>Tracking No: {order.trackingNumber || 'Pending Dispatch'}</p>
              <p>Estimated Delivery: {order.estimatedDelivery}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#1C1917] text-[#1C1917] uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5">Artifact Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3ECE0]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2.5">
                    <td className="py-2.5 font-mono text-[11px] text-[#78716C]">{item.sku}</td>
                    <td className="py-2.5">
                      <div className="font-medium text-[#1C1917]">{item.productName}</div>
                      <span className="text-[10px] text-[#A8A29E]">Certified Handcrafted</span>
                    </td>
                    <td className="py-2.5 text-center font-semibold">{item.quantity}</td>
                    <td className="py-2.5 text-right">{formatCurrency(item.unitPrice, currency)}</td>
                    <td className="py-2.5 text-right font-medium text-[#1C1917]">
                      {formatCurrency(item.total, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="border-t border-[#1C1917] pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-[#78716C] max-w-sm space-y-1">
              <span className="font-bold text-[#1C1917] uppercase tracking-wider block">
                Certificate &amp; Authenticity Guarantee:
              </span>
              <p className="font-light">
                All botanical artworks are crafted with UV-inhibited casting resins. Store in climate-controlled spaces out of direct prolonged exterior sunlight.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-[#57534E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal, currency)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Discount</span>
                  <span>-{formatCurrency(order.discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Courier Delivery</span>
                <span>{order.shipping === 0 ? 'Complimentary' : formatCurrency(order.shipping, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax / Duty</span>
                <span>{formatCurrency(order.tax, currency)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold font-serif text-[#1C1917] pt-2 border-t border-[#1C1917]">
                <span>Grand Total</span>
                <span className="text-base">{formatCurrency(order.total, currency)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#88672D] pt-1">
                <span>Amount Paid:</span>
                <span>{order.paymentStatus === 'Paid' ? formatCurrency(order.total, currency) : 'Pending COD Collection'}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms & Signatures */}
          <div className="pt-8 border-t border-[#E7DFD3] grid grid-cols-2 gap-6 items-end text-xs text-[#78716C]">
            <div>
              <p className="font-semibold text-[#1C1917] mb-1">Return &amp; Heirloom Warranty:</p>
              <p className="text-[11px] font-light leading-relaxed">
                Damaged transit claims must be reported within 48 hours with unboxing video footage. Handcrafted variations in organic floral placement are intentional hallmarks of artisanal individuality.
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="h-10 border-b border-[#1C1917] w-48 ml-auto" />
              <span className="text-[11px] font-serif uppercase tracking-widest text-[#1C1917] block">
                Authorized Atelier Signatory
              </span>
              <span className="text-[10px] text-[#A8A29E]">Heritage &amp; Elegance Curatorial Board</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
