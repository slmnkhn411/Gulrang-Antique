import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronDown,
  PhoneCall,
  MapPin
} from 'lucide-react';
import { SupportedCurrency, CURRENCY_SYMBOLS } from '../utils/currency';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  currency: SupportedCurrency;
  setCurrency: (cur: SupportedCurrency) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  onOpenAdmin,
  currency,
  setCurrency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const currencies: SupportedCurrency[] = ['PKR', 'USD', 'GBP', 'AED', 'EUR'];

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD3] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#1C1917] text-[#FAF7F2] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline text-[#D5C7B0]">Atelier Notice:</span>
            <span className="font-light">Handcrafted Elegance • Complimentary Museum Packaging • Worldwide Delivery</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] sm:text-xs">
            {/* Direct WhatsApp Call */}
            <a 
              href="https://wa.me/923149281875" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-1 text-[#D5C7B0] hover:text-[#C5A059] transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span className="hidden md:inline">+92 314 9281875</span>
            </a>

            {/* Currency Switcher */}
            <div className="relative">
              <button 
                id="currency-selector-btn"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center space-x-1 text-[#FAF7F2] hover:text-[#C5A059] transition-colors px-2 py-0.5 rounded bg-white/10"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-[#C5A059]" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-[#1C1917] border border-[#3E3833] rounded shadow-xl py-1 z-50">
                  {currencies.map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1 text-xs hover:bg-[#2C2723] flex items-center justify-between ${currency === c ? 'text-[#C5A059] font-medium' : 'text-[#D5C7B0]'}`}
                    >
                      <span>{c}</span>
                      <span className="text-[10px] opacity-70">{CURRENCY_SYMBOLS[c]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Switcher */}
            <button
              id="admin-portal-link"
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#C5A059]/20 text-[#D8B975] hover:bg-[#C5A059]/30 rounded transition-colors text-[11px] border border-[#C5A059]/30"
              title="Atelier Curator Portal"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#C5A059]" />
              <span>Salman Khan (Admin)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#1C1917] hover:text-[#C5A059] transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo & Brand Name */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('home')}>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl lg:text-3xl font-serif tracking-wider font-semibold text-[#1C1917]">
                  Gulrang <span className="text-[#C5A059] italic font-normal">Antique</span>
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#78716C] font-light">
                Curated Antiques • Handcrafted Resin Art • Heirlooms
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] tracking-wider uppercase font-medium text-[#44403C]">
            <button 
              id="nav-home"
              onClick={() => handleNav('home')}
              className={`hover:text-[#C5A059] transition-colors py-1 relative ${currentTab === 'home' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : ''}`}
            >
              Home
            </button>
            <button 
              id="nav-shop"
              onClick={() => handleNav('shop')}
              className={`hover:text-[#C5A059] transition-colors py-1 relative ${currentTab === 'shop' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : ''}`}
            >
              Shop Gallery
            </button>
            <button 
              id="nav-one-of-a-kind"
              onClick={() => handleNav('one-of-a-kind')}
              className="hover:text-[#C5A059] transition-colors py-1 relative text-[#9B783E] flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span>One of a Kind</span>
            </button>
            <button 
              id="nav-custom"
              onClick={() => handleNav('custom-orders')}
              className={`hover:text-[#C5A059] transition-colors py-1 relative ${currentTab === 'custom-orders' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : ''}`}
            >
              Custom Commissions
            </button>
            <button 
              id="nav-about"
              onClick={() => handleNav('about')}
              className={`hover:text-[#C5A059] transition-colors py-1 relative ${currentTab === 'about' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : ''}`}
            >
              Our Story
            </button>
            <button 
              id="nav-contact"
              onClick={() => handleNav('contact')}
              className={`hover:text-[#C5A059] transition-colors py-1 relative ${currentTab === 'contact' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : ''}`}
            >
              Concierge
            </button>
            <button 
              id="nav-map-guide"
              onClick={() => {
                handleNav('contact');
                setTimeout(() => {
                  const el = document.getElementById('atelier-maps-guide');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 120);
              }}
              className="hover:text-[#C5A059] transition-colors py-1 relative text-[#88672D] flex items-center space-x-1"
              title="Atelier Directions & Live Google Maps District Guide"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Atelier &amp; Map Guide</span>
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search */}
            <button
              id="search-open-btn"
              onClick={onOpenSearch}
              className="p-2 text-[#44403C] hover:text-[#C5A059] transition-colors"
              title="Search collection (Press /)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              id="wishlist-open-btn"
              onClick={onOpenWishlist}
              className="p-2 text-[#44403C] hover:text-[#C5A059] transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#9B783E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              id="account-open-btn"
              onClick={onOpenAccount}
              className="p-2 text-[#44403C] hover:text-[#C5A059] transition-colors"
              title="Customer Account & Orders"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              id="cart-open-btn"
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] px-3.5 py-2 rounded-full transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              title="Shopping Cart (View & Checkout)"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-semibold">{cartCount}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E7DFD3]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1C1917]">Gulrang Antique</h3>
                  <p className="text-[10px] tracking-wider uppercase text-[#78716C]">Atelier &amp; Gallery • Salman Khan</p>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 space-y-3 text-sm font-medium tracking-wide">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCart();
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg bg-[#1C1917] text-[#FAF7F2] flex items-center justify-between cursor-pointer shadow-sm"
                >
                  <span className="flex items-center space-x-2 font-semibold">
                    <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                    <span>View Shopping Cart</span>
                  </span>
                  <span className="px-2 py-0.5 bg-[#88672D] text-white text-xs font-bold rounded-full">
                    {cartCount}
                  </span>
                </button>

                <button
                  onClick={() => handleNav('home')}
                  className="block w-full text-left py-2 px-3 rounded hover:bg-[#F3ECE0] text-[#1C1917] cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNav('shop')}
                  className="block w-full text-left py-2 px-3 rounded hover:bg-[#F3ECE0] text-[#1C1917] cursor-pointer"
                >
                  Shop Full Collection
                </button>
                <button
                  onClick={() => handleNav('one-of-a-kind')}
                  className="block w-full text-left py-2 px-3 rounded hover:bg-[#F3ECE0] text-[#9B783E] font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span>One of a Kind Artifacts</span>
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                </button>
                <button
                  onClick={() => handleNav('custom-orders')}
                  className="block w-full text-left py-2 px-3 rounded hover:bg-[#F3ECE0] text-[#1C1917] cursor-pointer"
                >
                  Custom Commission Platter
                </button>
                <button
                  onClick={() => handleNav('about')}
                  className="block w-full text-left py-2 px-3 rounded hover:bg-[#F3ECE0] text-[#1C1917] cursor-pointer"
                >
                  Our Artisan Heritage
                </button>
                <button
                  onClick={() => handleNav('contact')}
                  className="block w-full text-left py-2 px-3 rounded hover:bg-[#F3ECE0] text-[#1C1917] cursor-pointer"
                >
                  Concierge &amp; Showroom
                </button>
                <button
                  onClick={() => {
                    handleNav('contact');
                    setTimeout(() => {
                      const el = document.getElementById('atelier-maps-guide');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }}
                  className="w-full text-left py-2 px-3 rounded bg-[#FAF7F2] hover:bg-[#F3ECE0] text-[#88672D] font-semibold flex items-center justify-between cursor-pointer border border-[#E7DFD3]"
                >
                  <span className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span>Atelier &amp; Google Maps Guide</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider bg-[#C5A059]/20 text-[#88672D] px-2 py-0.5 rounded font-bold">
                    Live
                  </span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="block w-full text-left py-2 px-3 rounded bg-[#C5A059]/15 text-[#88672D] font-semibold cursor-pointer"
                >
                  Switch to Admin Portal
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7DFD3] space-y-3 text-xs text-[#78716C]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Certified Botanical &amp; Antique Quality</span>
              </div>
              <p>Direct Atelier Concierge: +92 314 9281875 (Salman Khan)</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
