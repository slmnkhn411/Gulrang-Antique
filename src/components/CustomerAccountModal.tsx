import React, { useState } from 'react';
import { 
  X, 
  User, 
  Package, 
  Heart, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Sparkles,
  MapPin,
  LogOut
} from 'lucide-react';
import { Order, CustomOrderRequest, Product } from '../types';
import { SupportedCurrency, formatCurrency } from '../utils/currency';
import { StoreService } from '../services/store';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: SupportedCurrency;
  wishlist: string[];
  allProducts: Product[];
  onViewInvoice: (order: Order) => void;
  onOpenProduct: (product: Product) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  currency,
  wishlist,
  allProducts,
  onViewInvoice,
  onOpenProduct
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'commissions' | 'wishlist' | 'profile'>('orders');
  const orders = StoreService.getOrders();
  const customOrders = StoreService.getCustomOrders();
  const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-4xl w-full max-h-[94dvh] overflow-y-auto shadow-2xl border border-[#DFD1BD] z-10 p-4 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#E7DFD3]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#FAF7F2] flex items-center justify-center font-serif text-lg font-bold shrink-0">
              HE
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1917]">Customer Atelier Account</h2>
              <p className="text-xs text-[#78716C]">Manage acquisitions, tracking, commission quotes &amp; wishlists</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F3ECE0] text-[#78716C] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Close account modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E7DFD3] text-xs font-semibold tracking-wider uppercase text-[#78716C] mt-3 sm:mt-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center space-x-1.5 transition-colors shrink-0 min-h-[44px] whitespace-nowrap cursor-pointer ${
              activeTab === 'orders' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('commissions')}
            className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center space-x-1.5 transition-colors shrink-0 min-h-[44px] whitespace-nowrap cursor-pointer ${
              activeTab === 'commissions' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Custom Commissions ({customOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center space-x-1.5 transition-colors shrink-0 min-h-[44px] whitespace-nowrap cursor-pointer ${
              activeTab === 'wishlist' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlistedProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center space-x-1.5 transition-colors shrink-0 min-h-[44px] whitespace-nowrap cursor-pointer ${
              activeTab === 'profile' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Addresses</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="py-4 sm:py-6">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-[#78716C]">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>You have not placed any orders yet.</p>
                </div>
              ) : (
                orders.map(ord => (
                  <div key={ord.id} className="bg-white rounded-xl border border-[#E7DFD3] p-4 sm:p-5 space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3ECE0] pb-3 text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#1C1917] text-sm">{ord.orderNumber}</span>
                        <span className="text-[#78716C] ml-2">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F3ECE0] text-[#88672D]">
                          {ord.orderStatus}
                        </span>
                        <button
                          onClick={() => onViewInvoice(ord)}
                          className="flex items-center space-x-1 px-3 py-1 bg-[#1C1917] text-[#FAF7F2] text-xs rounded hover:bg-[#2C2723]"
                        >
                          <FileText className="w-3 h-3 text-[#C5A059]" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-2">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center space-x-3 text-xs">
                          <img src={it.image} alt="" className="w-12 h-12 rounded object-cover bg-gray-100 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[#1C1917] truncate">{it.productName}</h4>
                            <span className="text-[10px] text-[#A8A29E] font-mono">SKU: {it.sku}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-500">Qty: {it.quantity}</span>
                            <p className="font-semibold text-[#1C1917]">{formatCurrency(it.total, currency)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progress tracking line */}
                    <div className="pt-2 border-t border-[#F3ECE0] flex items-center justify-between text-[11px] text-[#78716C]">
                      <div className="flex items-center space-x-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#88672D]" />
                        <span>Courier: <strong>{ord.courier || 'TCS Express'}</strong></span>
                        {ord.trackingNumber && <span>(Tracking #{ord.trackingNumber})</span>}
                      </div>
                      <div className="font-semibold text-sm text-[#1C1917]">
                        Total: {formatCurrency(ord.total, currency)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* COMMISSIONS TAB */}
          {activeTab === 'commissions' && (
            <div className="space-y-4">
              {customOrders.length === 0 ? (
                <div className="text-center py-12 text-[#78716C]">
                  <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No custom commissions submitted yet.</p>
                </div>
              ) : (
                customOrders.map(cus => (
                  <div key={cus.id} className="bg-white rounded-xl border border-[#E7DFD3] p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3ECE0] pb-2 text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#88672D] text-sm">{cus.ticketNumber}</span>
                        <span className="text-[#78716C] ml-2 font-medium">• {cus.productType}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                        {cus.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#57534E] leading-relaxed">
                      "{cus.description}"
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-[#FAF7F2] p-2.5 rounded border border-[#E7DFD3]">
                      <div>
                        <span className="text-[#78716C] block">Size:</span>
                        <span className="font-medium text-[#1C1917]">{cus.preferredSize}</span>
                      </div>
                      <div>
                        <span className="text-[#78716C] block">Colors:</span>
                        <span className="font-medium text-[#1C1917]">{cus.preferredColors}</span>
                      </div>
                      <div>
                        <span className="text-[#78716C] block">Target Budget:</span>
                        <span className="font-medium text-[#1C1917]">{cus.budget}</span>
                      </div>
                      <div>
                        <span className="text-[#78716C] block">Required Date:</span>
                        <span className="font-medium text-[#1C1917]">{cus.requiredDate}</span>
                      </div>
                    </div>

                    {cus.quotationAmount && (
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                        <div>
                          <strong className="block text-sm">Curator Quotation: {formatCurrency(cus.quotationAmount, currency)}</strong>
                          <span className="text-[11px] text-emerald-700">Deposit required to commence casting: {formatCurrency(cus.depositRequired || 0, currency)}</span>
                          {cus.adminNotes && <p className="text-[11px] mt-1 italic">Note: {cus.adminNotes}</p>}
                        </div>
                        <button className="px-4 py-2 bg-emerald-700 text-white rounded text-xs font-semibold uppercase">
                          Approve Quote
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-12 text-[#78716C]">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>Your wishlist is empty. Tap the heart on any piece to save it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistedProducts.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => onOpenProduct(p)}
                      className="cursor-pointer bg-white p-3 rounded-xl border border-[#E7DFD3] flex items-center space-x-3 hover:border-[#88672D] transition-all"
                    >
                      <img src={p.images[0]} alt="" className="w-16 h-16 rounded object-cover bg-gray-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-semibold text-[#1C1917] truncate">{p.name}</h4>
                        <span className="text-xs font-bold text-[#88672D]">{formatCurrency(p.salePrice || p.price, currency)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E7DFD3] space-y-4 max-w-lg">
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">Patron Profile &amp; Preferences</h3>
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#78716C] mb-1.5 uppercase tracking-wider font-semibold text-[11px]">Account Holder</label>
                  <input type="text" defaultValue="Maryam Nawaz" className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg min-h-[44px] focus:outline-none focus:border-[#C5A059]" />
                </div>
                <div>
                  <label className="block text-[#78716C] mb-1.5 uppercase tracking-wider font-semibold text-[11px]">Registered Email</label>
                  <input type="email" defaultValue="maryam.n@example.com" className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg min-h-[44px] focus:outline-none focus:border-[#C5A059]" />
                </div>
                <div>
                  <label className="block text-[#78716C] mb-1.5 uppercase tracking-wider font-semibold text-[11px]">Default Delivery Address</label>
                  <textarea defaultValue="House 24, Block G, Gulberg III, Lahore, Pakistan" rows={2} className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg focus:outline-none focus:border-[#C5A059]" />
                </div>
                <button className="w-full sm:w-auto px-6 py-3 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-lg min-h-[46px] cursor-pointer transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
