import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText,
  Lock,
  Building2,
  Smartphone
} from 'lucide-react';
import { CartItem, Coupon, Order, PaymentMethodType } from '../types';
import { SupportedCurrency, formatCurrency } from '../utils/currency';
import { StoreService } from '../services/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: SupportedCurrency;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  appliedCoupon,
  couponDiscount,
  onOrderSuccess,
  onClearCart
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const settings = StoreService.getSettings();

  // Step 1: Customer info
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '54000',
    country: 'Pakistan'
  });

  // Step 2: Shipping method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'pickup'>('standard');

  // Step 3: Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [transactionRef, setTransactionRef] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Step 4: Completed order state
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const qualifiesForFreeShipping = subtotal >= settings.freeShippingThreshold && shippingMethod === 'standard';
  const shippingCost = shippingMethod === 'pickup' 
    ? 0 
    : shippingMethod === 'express' 
      ? settings.expressShippingFee 
      : qualifiesForFreeShipping ? 0 : settings.standardShippingFee;

  const tax = Math.round((subtotal - couponDiscount) * (settings.taxRatePercent / 100));
  const grandTotal = Math.max(0, subtotal - couponDiscount + tax + shippingCost);

  const handlePlaceOrder = () => {
    const items = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      unitPrice: item.product.salePrice || item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      total: (item.product.salePrice || item.product.price) * item.quantity
    }));

    const orderData = {
      customerInfo,
      items,
      subtotal,
      discount: couponDiscount,
      couponCode: appliedCoupon?.code,
      tax,
      shipping: shippingCost,
      shippingMethod,
      total: grandTotal,
      paymentMethod,
      paymentStatus: (paymentMethod === 'cod' ? 'Pending' : 'Paid') as Order['paymentStatus'],
      orderStatus: (paymentMethod === 'cod' ? 'Order Placed' : 'Payment Verification') as Order['orderStatus'],
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const newOrder = StoreService.createOrder(orderData);
    setConfirmedOrder(newOrder);
    onClearCart();
    onOrderSuccess(newOrder);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={() => step !== 4 && onClose()}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-3xl w-full max-h-[94dvh] overflow-y-auto shadow-2xl border border-[#DFD1BD] z-10 p-4 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#E7DFD3]">
          <div>
            <span className="text-[10px] tracking-widest uppercase text-[#88672D] font-bold block">
              Secure Checkout • Heritage &amp; Elegance
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1917]">
              {step === 4 ? 'Order Confirmed & Invoice Issued' : 'Complete Your Acquisition'}
            </h2>
          </div>
          {step !== 4 && (
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F3ECE0] text-[#78716C] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 4 && (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-3 sm:py-4 border-b border-[#F3ECE0] text-xs">
            <div className={`flex items-center space-x-1.5 sm:space-x-2 ${step >= 1 ? 'text-[#88672D] font-semibold' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] ${step >= 1 ? 'bg-[#88672D] text-white' : 'bg-gray-200'}`}>1</div>
              <span className="text-[11px] sm:text-xs">Information</span>
            </div>
            <div className={`flex items-center space-x-1.5 sm:space-x-2 ${step >= 2 ? 'text-[#88672D] font-semibold' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] ${step >= 2 ? 'bg-[#88672D] text-white' : 'bg-gray-200'}`}>2</div>
              <span className="text-[11px] sm:text-xs">Shipping</span>
            </div>
            <div className={`flex items-center space-x-1.5 sm:space-x-2 ${step >= 3 ? 'text-[#88672D] font-semibold' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] ${step >= 3 ? 'bg-[#88672D] text-white' : 'bg-gray-200'}`}>3</div>
              <span className="text-[11px] sm:text-xs">Payment</span>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="py-4 sm:py-6">
          
          {/* STEP 1: Customer Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">Delivery Address</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Malik"
                    value={customerInfo.fullName}
                    onChange={e => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                  Email Address (For Invoicing &amp; Tracking) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="recipient@example.com"
                  value={customerInfo.email}
                  onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                  Street Address / House No / Apartment *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 42, Block B, Gulberg"
                  value={customerInfo.address}
                  onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">City</label>
                  <input
                    type="text"
                    value={customerInfo.city}
                    onChange={e => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#E7DFD3] rounded-lg text-base sm:text-xs text-[#1C1917] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">Province</label>
                  <input
                    type="text"
                    value={customerInfo.province}
                    onChange={e => setCustomerInfo({ ...customerInfo, province: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#E7DFD3] rounded-lg text-base sm:text-xs text-[#1C1917] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">Postal Code</label>
                  <input
                    type="text"
                    value={customerInfo.postalCode}
                    onChange={e => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#E7DFD3] rounded-lg text-base sm:text-xs text-[#1C1917] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">Country</label>
                  <input
                    type="text"
                    value={customerInfo.country}
                    onChange={e => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#E7DFD3] rounded-lg text-base sm:text-xs text-[#1C1917] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  disabled={!customerInfo.fullName || !customerInfo.phone || !customerInfo.address}
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs font-semibold tracking-widest uppercase rounded-lg shadow-md disabled:bg-gray-300 flex items-center justify-center space-x-2 transition-all cursor-pointer min-h-[48px]"
                >
                  <span>Continue to Shipping</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">Select Shipping Tier</h3>

              <div className="space-y-3">
                {/* Standard */}
                <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === 'standard' ? 'bg-[#F3ECE0] border-[#88672D]' : 'bg-white border-[#E7DFD3]'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="text-[#88672D] focus:ring-0"
                    />
                    <div>
                      <span className="font-semibold text-sm text-[#1C1917] block">Standard Insured Courier (3-5 Days)</span>
                      <span className="text-xs text-[#78716C]">TCS / Leopards courier with protective packaging</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#1C1917]">
                    {qualifiesForFreeShipping ? 'FREE' : formatCurrency(settings.standardShippingFee, currency)}
                  </span>
                </label>

                {/* Express */}
                <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === 'express' ? 'bg-[#F3ECE0] border-[#88672D]' : 'bg-white border-[#E7DFD3]'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="text-[#88672D] focus:ring-0"
                    />
                    <div>
                      <span className="font-semibold text-sm text-[#1C1917] block">Express White-Glove (24-48 Hours)</span>
                      <span className="text-xs text-[#78716C]">Priority dispatch with dedicated fragile crate handling</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#1C1917]">
                    {formatCurrency(settings.expressShippingFee, currency)}
                  </span>
                </label>

                {/* Local Studio Pickup */}
                <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === 'pickup' ? 'bg-[#F3ECE0] border-[#88672D]' : 'bg-white border-[#E7DFD3]'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'pickup'}
                      onChange={() => setShippingMethod('pickup')}
                      className="text-[#88672D] focus:ring-0"
                    />
                    <div>
                      <span className="font-semibold text-sm text-[#1C1917] block">Atelier Studio Pickup</span>
                      <span className="text-xs text-[#78716C]">Complimentary collection from our Lahore Gallery</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#1C1917]">FREE</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] flex items-center space-x-1 min-h-[44px] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3.5 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs font-semibold tracking-widest uppercase rounded-lg shadow-md flex items-center space-x-2 min-h-[46px] cursor-pointer transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">Choose Payment Gateway</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <label className={`p-3.5 rounded-xl border cursor-pointer flex items-start space-x-3 ${
                  paymentMethod === 'cod' ? 'bg-[#F3ECE0] border-[#88672D]' : 'bg-white border-[#E7DFD3]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#88672D] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#1C1917] block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-[#78716C]">Inspect piece upon delivery &amp; hand cash to courier</span>
                  </div>
                </label>

                {/* JazzCash */}
                <label className={`p-3.5 rounded-xl border cursor-pointer flex items-start space-x-3 ${
                  paymentMethod === 'jazzcash' ? 'bg-[#F3ECE0] border-[#88672D]' : 'bg-white border-[#E7DFD3]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'jazzcash'}
                    onChange={() => setPaymentMethod('jazzcash')}
                    className="mt-1 text-[#88672D] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#1C1917] block">JazzCash Mobile Wallet</span>
                    <span className="text-[11px] text-[#78716C]">Instant direct mobile account checkout</span>
                  </div>
                </label>

                {/* Easypaisa */}
                <label className={`p-3.5 rounded-xl border cursor-pointer flex items-start space-x-3 ${
                  paymentMethod === 'easypaisa' ? 'bg-[#F3ECE0] border-[#88672D]' : 'bg-white border-[#E7DFD3]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'easypaisa'}
                    onChange={() => setPaymentMethod('easypaisa')}
                    className="mt-1 text-[#88672D] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#1C1917] block">Easypaisa</span>
                    <span className="text-[11px] text-[#78716C]">Pay via Telenor Easypaisa wallet or debit</span>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label className={`p-3.5 rounded-xl border cursor-pointer flex items-start space-x-3 ${
                  paymentMethod === 'bank_transfer' ? 'bg-[#F3ECE0] border-[#88672D]' : 'bg-white border-[#E7DFD3]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1 text-[#88672D] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#1C1917] block">Bank Wire Transfer (IBFT)</span>
                    <span className="text-[11px] text-[#78716C]">Meezan Bank &amp; Standard Chartered Pakistan</span>
                  </div>
                </label>

                {/* Debit/Credit Card */}
                <label className={`p-3.5 rounded-xl border cursor-pointer flex items-start space-x-3 sm:col-span-2 ${
                  paymentMethod === 'card' ? 'bg-[#F3ECE0] border-[#88672D]' : 'bg-white border-[#E7DFD3]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-[#88672D] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#1C1917] block">Credit / Debit Card (Visa, Mastercard, PayPak)</span>
                    <span className="text-[11px] text-[#78716C]">Tokenized 256-bit SSL encrypted gateway</span>
                  </div>
                </label>
              </div>

              {/* Bank Transfer Details Box */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 bg-white rounded-xl border border-[#DFD1BD] text-xs text-[#57534E] space-y-2">
                  <div className="flex items-center space-x-2 text-[#88672D] font-semibold">
                    <Building2 className="w-4 h-4" />
                    <span>Official Atelier Corporate Account:</span>
                  </div>
                  <div className="font-mono text-[11px] space-y-0.5 bg-[#FAF7F2] p-2.5 rounded border border-[#E7DFD3]">
                    <p>Bank: Meezan Bank Limited (Gulberg Main Branch)</p>
                    <p>Title: Heritage &amp; Elegance Atelier (Pvt) Ltd</p>
                    <p>Account No: 0281-0105829103</p>
                    <p>IBAN: PK64MEZN0002810105829103</p>
                  </div>
                  <p className="text-[10px] text-[#78716C]">
                    Please note your Order Number in the IBFT transfer narration.
                  </p>
                </div>
              )}

              {/* Summary of Grand Total */}
              <div className="p-4 rounded-xl bg-white border border-[#E7DFD3] space-y-1.5 text-xs text-[#57534E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal, currency)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-{formatCurrency(couponDiscount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax ({settings.taxRatePercent}%)</span>
                  <span>{formatCurrency(tax, currency)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#1C1917] pt-2 border-t border-[#F3ECE0]">
                  <span>Total Due</span>
                  <span className="text-xl">{formatCurrency(grandTotal, currency)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-[#78716C]">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>PCI-DSS Tokenized Security: No sensitive payment card data is retained on our web server.</span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] flex items-center space-x-1 min-h-[44px] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="px-6 sm:px-8 py-3.5 bg-[#88672D] hover:bg-[#9B783E] text-white text-xs sm:text-sm font-semibold tracking-widest uppercase rounded-lg shadow-lg flex items-center space-x-2 transition-all min-h-[48px] cursor-pointer"
                >
                  <span>Authorize &amp; Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation & Instant Invoice Access */}
          {step === 4 && confirmedOrder && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#88672D] font-bold">Acquisition Confirmed</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917] mt-1">
                  Thank You for Your Order
                </h3>
                <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-md mx-auto">
                  Your piece has been registered and reserved in our studio atelier.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-[#E7DFD3] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Order Reference:</span>
                  <span className="font-mono font-bold text-[#1C1917]">{confirmedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Invoice Number:</span>
                  <span className="font-mono font-bold text-[#88672D]">{confirmedOrder.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Customer:</span>
                  <span className="font-medium text-[#1C1917]">{confirmedOrder.customerInfo.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Payment Method:</span>
                  <span className="font-medium uppercase text-[#1C1917]">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Status:</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-semibold">
                    {confirmedOrder.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#F3ECE0] font-bold text-sm">
                  <span>Grand Total:</span>
                  <span className="font-serif text-base">{formatCurrency(confirmedOrder.total, currency)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    // trigger invoice view
                    window.dispatchEvent(new CustomEvent('he_view_invoice', { detail: { order: confirmedOrder } }));
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs font-semibold tracking-widest uppercase rounded-lg shadow flex items-center justify-center space-x-2 min-h-[46px] cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#C5A059]" />
                  <span>View Official Printable Invoice</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#E7DFD3] text-[#1C1917] text-xs font-semibold tracking-widest uppercase rounded-lg hover:bg-[#F3ECE0] min-h-[46px] cursor-pointer"
                >
                  Return to Atelier
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
