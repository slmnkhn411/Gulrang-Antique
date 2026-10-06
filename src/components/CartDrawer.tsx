import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Coupon } from '../types';
import { SupportedCurrency, formatCurrency } from '../utils/currency';
import { StoreService } from '../services/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: SupportedCurrency;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null, discountAmount: number) => void;
  couponDiscount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  appliedCoupon,
  onApplyCoupon,
  couponDiscount
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const settings = StoreService.getSettings();
  const qualifiesForFreeShipping = subtotal >= settings.freeShippingThreshold;
  const shippingFee = qualifiesForFreeShipping ? 0 : settings.standardShippingFee;
  const tax = Math.round((subtotal - couponDiscount) * (settings.taxRatePercent / 100));
  const grandTotal = Math.max(0, subtotal - couponDiscount + tax + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const res = StoreService.validateCoupon(couponInput, subtotal);
    if (!res.valid) {
      setCouponError(res.message);
      return;
    }

    onApplyCoupon(res.coupon || null, res.discount);
    setCouponSuccess(`Code applied! You saved ${formatCurrency(res.discount, currency)}`);
    setCouponInput('');
  };

  const removeCoupon = () => {
    onApplyCoupon(null, 0);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl border-l border-[#DFCBB0] flex flex-col justify-between h-[100dvh]"
            >
              
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#E7DFD3] flex items-center justify-between bg-white">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#88672D]" />
                  <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#1C1917]">Your Atelier Cart</h2>
                  <span className="text-xs text-[#78716C]">({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                </div>
                <button 
                  id="close-cart-btn"
                  onClick={onClose}
                  className="p-2 text-[#78716C] hover:text-[#1C1917] rounded-full hover:bg-[#F3ECE0] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-[#DFCBB0] mx-auto" />
                    <p className="font-serif text-lg text-[#1C1917]">Your cart is currently empty</p>
                    <p className="text-xs text-[#78716C] max-w-xs mx-auto font-light">
                      Explore our collection of handcrafted resin salvers and certified antique heirlooms.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-3 px-5 py-2.5 bg-[#1C1917] text-[#FAF7F2] text-xs font-semibold tracking-wider uppercase rounded hover:bg-[#2C2723] transition-colors cursor-pointer min-h-[44px]"
                    >
                      Continue Browsing
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Free shipping progress */}
                    <div className="p-3 bg-white rounded-lg border border-[#E7DFD3] text-xs">
                      {qualifiesForFreeShipping ? (
                        <div className="flex items-center space-x-2 text-emerald-800 font-medium">
                          <Sparkles className="w-4 h-4 text-[#C5A059]" />
                          <span>Complimentary Insured Delivery unlocked!</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[#57534E]">
                            Add <strong>{formatCurrency(settings.freeShippingThreshold - subtotal, currency)}</strong> more for Complimentary Delivery
                          </span>
                          <div className="w-full bg-[#E7DFD3] h-1.5 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="bg-[#88672D] h-full rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (subtotal / settings.freeShippingThreshold) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {cart.map(item => {
                        const price = item.product.salePrice || item.product.price;
                        return (
                          <div 
                            key={item.product.id}
                            className="bg-white p-3 rounded-xl border border-[#E7DFD3] flex gap-3 items-center"
                          >
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              className="w-18 h-18 rounded-lg object-cover bg-[#F3ECE0] shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-sm font-semibold text-[#1C1917] truncate">
                                {item.product.name}
                              </h4>
                              <span className="text-[10px] text-[#A8A29E] font-mono block">
                                SKU: {item.product.sku}
                              </span>
                              <span className="text-xs font-bold text-[#1C1917] font-sans">
                                {formatCurrency(price, currency)}
                              </span>

                              <div className="flex items-center justify-between mt-2">
                                {/* Quantity buttons */}
                                <div className="flex items-center border border-[#E7DFD3] rounded-lg text-xs bg-[#FAF7F2] overflow-hidden">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 cursor-pointer text-sm font-medium"
                                    aria-label="Decrease quantity"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 font-semibold text-xs">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                    disabled={item.product.isOneOfAKind || item.quantity >= item.product.stock}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 cursor-pointer text-sm font-medium"
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors p-2 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                                  title="Remove item"
                                  aria-label={`Remove ${item.product.name} from cart`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Footer Totals & Checkout */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 bg-white border-t border-[#E7DFD3] space-y-4 pb-[calc(1.25rem+var(--sab))]">
                  
                  {/* Coupon Form */}
                  <div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 bg-[#F3ECE0] rounded-lg text-xs text-[#88672D] font-medium border border-[#DFCBB0]">
                        <div className="flex items-center space-x-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Code: <strong>{appliedCoupon.code}</strong> (-{formatCurrency(couponDiscount, currency)})</span>
                        </div>
                        <button onClick={removeCoupon} className="text-xs text-red-600 hover:underline cursor-pointer p-1">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Coupon Code (e.g. HERITAGE10)"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 px-3.5 py-2.5 text-base sm:text-xs bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[44px]"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2.5 bg-[#1C1917] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#2C2723] cursor-pointer min-h-[44px]"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
                    {couponSuccess && <p className="text-[11px] text-emerald-700 mt-1">{couponSuccess}</p>}
                  </div>

                  {/* Cost Summary Breakdown */}
                  <div className="space-y-1.5 text-xs text-[#57534E] pt-2 border-t border-[#F3ECE0]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#1C1917]">{formatCurrency(subtotal, currency)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount</span>
                        <span>-{formatCurrency(couponDiscount, currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax ({settings.taxRatePercent}%)</span>
                      <span>{formatCurrency(tax, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-serif font-bold text-[#1C1917] pt-2 border-t border-[#F3ECE0]">
                      <span>Total Amount</span>
                      <span className="text-lg">{formatCurrency(grandTotal, currency)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    id="cart-proceed-checkout-btn"
                    onClick={() => {
                      onClose();
                      onCheckout();
                    }}
                    className="w-full py-4 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs sm:text-sm font-semibold tracking-widest uppercase rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer min-h-[50px]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                  </button>

                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
