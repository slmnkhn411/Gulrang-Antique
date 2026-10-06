import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, Coupon } from './types';
import { SupportedCurrency, formatCurrency } from './utils/currency';
import { StoreService } from './services/store';

// Core Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedCategories } from './components/FeaturedCategories';
import { ProductCard } from './components/ProductCard';
import { MasterpiecesSection } from './components/MasterpiecesSection';
import { OneOfAKindSection } from './components/OneOfAKindSection';
import { CustomCommissionSection } from './components/CustomCommissionSection';
import { ReviewsSection } from './components/ReviewsSection';
import { TrustSection } from './components/TrustSection';
import { ShopView } from './components/ShopView';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTopButton } from './components/BackToTopButton';

// Modals & Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { QuickSearchModal } from './components/QuickSearchModal';

import { Sparkles, ArrowRight, Heart, ShoppingBag, Check, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation & View
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currency, setCurrency] = useState<SupportedCurrency>('PKR');

  // State Collections
  const [products, setProducts] = useState<Product[]>(() => StoreService.getProducts());
  const [cart, setCart] = useState<CartItem[]>(() => StoreService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => StoreService.getWishlist());

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Modals Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Selected Detail Views
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Synchronize cart & wishlist changes to StoreService
  const refreshProducts = () => {
    setProducts(StoreService.getProducts());
  };

  const handleAddToCart = (product: Product, quantity = 1, openCart = true) => {
    if (product.isSold) {
      showToast("This one-of-a-kind piece has already been acquired.");
      return;
    }

    const updated = StoreService.addToCart(product, quantity);
    setCart(updated);
    showToast(`Added "${product.name}" to your Atelier cart`);

    // Automatically open the cart drawer so the user sees the newly added piece immediately
    if (openCart) {
      setIsCartOpen(true);
      setSelectedProduct(null);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const updated = StoreService.updateCartQuantity(productId, quantity);
    setCart(updated);
  };

  const handleRemoveItem = (productId: string) => {
    const updated = StoreService.removeFromCart(productId);
    setCart(updated);
    showToast("Piece removed from cart");
  };

  const handleToggleWishlist = (productId: string) => {
    const updated = StoreService.toggleWishlist(productId);
    setWishlist(updated);
    const isNowWishlisted = updated.includes(productId);
    showToast(isNowWishlisted ? "Saved to your Atelier Wishlist" : "Removed from Wishlist");
  };

  const handleClearCart = () => {
    StoreService.clearCart();
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Keyboard shortcut listener for '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Listen for custom event from checkout to open invoice directly
  useEffect(() => {
    const handleViewInvoiceEvent = (e: any) => {
      if (e.detail && e.detail.order) {
        setInvoiceOrder(e.detail.order);
        setIsInvoiceOpen(true);
      }
    };
    window.addEventListener('he_view_invoice', handleViewInvoiceEvent);
    return () => window.removeEventListener('he_view_invoice', handleViewInvoiceEvent);
  }, []);

  // Quick navigation to category
  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    setCurrentTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Total cart item quantity
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Express Buy Now handler
  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity, false);
    setIsCartOpen(false);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1917] font-sans antialiased selection:bg-[#C5A059] selection:text-white relative">
      
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 bg-[#1C1917] text-[#FAF7F2] px-4 py-3 rounded-xl shadow-2xl border border-[#C5A059]/40 flex items-center space-x-3 text-xs tracking-wide"
          >
            <div className="w-5 h-5 rounded-full bg-[#88672D] flex items-center justify-center text-white flex-shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span className="max-w-xs">{toastMessage}</span>
            <button
              onClick={() => {
                setToastMessage(null);
                setIsCartOpen(true);
              }}
              className="ml-2 px-2.5 py-1 bg-[#C5A059] hover:bg-[#D4AF37] text-[#1C1917] font-semibold text-[11px] uppercase tracking-wider rounded transition-colors flex-shrink-0 cursor-pointer shadow-xs"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Back to Top Button */}
      <BackToTopButton threshold={420} />

      {/* Floating Concierge / WhatsApp Salman Khan */}
      <aside aria-label="WhatsApp Concierge" className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/923149281875?text=Hello%20Salman%20Khan,%20I%20am%20inquiring%20about%20a%20Gulrang%20Antique%20piece%20and%20need%20assistance."
          target="_blank"
          rel="noopener noreferrer"
          id="floating-whatsapp-btn"
          className="flex items-center space-x-2.5 bg-[#1C1917] hover:bg-[#2C2723] text-white px-4 py-3 rounded-full shadow-2xl border border-[#DFCBB0]/60 transition-all transform hover:scale-105 group cursor-pointer"
          title="Direct WhatsApp Consultation with Salman Khan"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#E8DCC4] group-hover:text-white">
            WhatsApp Salman Khan
          </span>
        </a>
      </aside>

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsAccountOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Dynamic View Body */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME */}
        {currentTab === 'home' && (
          <div className="flex flex-col">
            
            {/* Hero Banner */}
            <HeroSection
              onExplore={() => {
                setCurrentTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCustomOrder={() => {
                setCurrentTab('custom-orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Curated Disciplines Categories */}
            <FeaturedCategories onSelectCategory={handleSelectCategory} />

            {/* Masterpiece Gallery with Adjustable Density & Category Tabs */}
            <MasterpiecesSection
              products={products}
              currency={currency}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onQuickView={setSelectedProduct}
              onViewAll={() => {
                setCurrentTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* One of a Kind Curated Vault */}
            <OneOfAKindSection
              products={products}
              currency={currency}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onQuickView={setSelectedProduct}
              onViewAll={() => {
                setCurrentTab('one-of-a-kind');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Custom Commissions Atelier Highlight */}
            <CustomCommissionSection
              onInquirySubmitted={() => {
                showToast("Custom commission inquiry logged! Salman Khan will formulate a tailored quotation.");
              }}
            />

            {/* Verified Patron Accolades & Testimonials */}
            <ReviewsSection />

            {/* Pillars of Trust */}
            <TrustSection />

          </div>
        )}

        {/* VIEW 2: SHOP CATALOG */}
        {currentTab === 'shop' && (
          <ShopView
            products={products}
            currency={currency}
            wishlist={wishlist}
            initialCategory={selectedCategory}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onQuickView={setSelectedProduct}
          />
        )}

        {/* VIEW 3: ONE OF A KIND EXCLUSIVE */}
        {currentTab === 'one-of-a-kind' && (
          <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#88672D] font-bold">
                Exclusive Vault • Certified Unicum
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1C1917]">
                One of a Kind Masterpieces
              </h1>
              <p className="text-xs sm:text-sm text-[#57534E] max-w-2xl mx-auto font-light leading-relaxed">
                Singular creations cast with rare wild botanical pressings and certified antique treasures. Each item is permanently locked upon purchase and will never be reproduced.
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.filter(p => p.isOneOfAKind).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: CUSTOM COMMISSIONS */}
        {currentTab === 'custom-orders' && (
          <div className="py-10">
            <CustomCommissionSection
              onInquirySubmitted={() => {
                showToast("Custom commission inquiry logged! We will formulate a tailored quotation.");
              }}
            />
          </div>
        )}

        {/* VIEW 5: OUR STORY */}
        {currentTab === 'about' && (
          <AboutSection />
        )}

        {/* VIEW 6: CONCIERGE & CONTACT */}
        {currentTab === 'contact' && (
          <ContactSection />
        )}

      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          if (tab === 'custom') setCurrentTab('custom-orders');
          else setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MODAL 1: Product Detail View */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        currency={currency}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        allProducts={products}
        onSelectRelatedProduct={(p) => setSelectedProduct(p)}
      />

      {/* MODAL 2: Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(c, discount) => {
          setAppliedCoupon(c);
          setCouponDiscount(discount);
        }}
        couponDiscount={couponDiscount}
      />

      {/* MODAL 3: Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        currency={currency}
        appliedCoupon={appliedCoupon}
        couponDiscount={couponDiscount}
        onClearCart={handleClearCart}
        onOrderSuccess={(order) => {
          showToast(`Order #${order.orderNumber} successfully registered!`);
        }}
      />

      {/* MODAL 4: Invoice Modal (Printable PDF) */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        order={invoiceOrder}
        onClose={() => setIsInvoiceOpen(false)}
        currency={currency}
      />

      {/* MODAL 5: Customer Account & Tracking */}
      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currency={currency}
        wishlist={wishlist}
        allProducts={products}
        onViewInvoice={(ord) => {
          setInvoiceOrder(ord);
          setIsInvoiceOpen(true);
        }}
        onOpenProduct={(p) => {
          setIsAccountOpen(false);
          setSelectedProduct(p);
        }}
      />

      {/* MODAL 6: Back-Office Admin Dashboard */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currency={currency}
        onViewInvoice={(ord) => {
          setInvoiceOrder(ord);
          setIsInvoiceOpen(true);
        }}
        onRefreshProducts={refreshProducts}
      />

      {/* MODAL 7: Quick Search Bar */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currency={currency}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
        }}
      />

    </div>
  );
}
