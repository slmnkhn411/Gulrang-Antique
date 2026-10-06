import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles, SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react';
import { Product } from '../types';
import { SupportedCurrency } from '../utils/currency';
import { ProductCard } from './ProductCard';

interface MasterpiecesSectionProps {
  products: Product[];
  currency: SupportedCurrency;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow?: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onViewAll: () => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Masterpieces' },
  { id: 'Resin Art', label: 'Resin Art' },
  { id: 'Decorative Plates', label: 'Decorative Plates' },
  { id: 'Antique Décor', label: 'Antique Décor' },
  { id: 'Decorative Trays', label: 'Decorative Trays' },
  { id: 'Wall Art', label: 'Wall Art & Clocks' }
];

export const MasterpiecesSection: React.FC<MasterpiecesSectionProps> = ({
  products,
  currency,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onQuickView,
  onViewAll
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [columnLayout, setColumnLayout] = useState<'4-col' | '3-col'>('4-col');
  const [spacingDensity, setSpacingDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Filter products by selected tab
  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') {
      return products.slice(0, 8);
    }
    const matching = products.filter(p => p.category === activeTab);
    return matching.length > 0 ? matching.slice(0, 8) : products.slice(0, 8);
  }, [products, activeTab]);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAF7F2] via-[#F5EEE3] to-[#FAF7F2] border-y border-[#E7DFD3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6 border-b border-[#DFCBB0]/60 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EBDDC5] text-[#88672D] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Curator's Seasonal Acquisitions</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
              Masterpiece Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-light max-w-xl">
              Handcrafted botanicals in crystal bio-resin and certified Mughal antiques preserved for generations.
            </p>
          </div>

          {/* Right Action & Adjustable Layout Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Adjustable Column Layout Selector */}
            <div className="flex items-center bg-white p-1 rounded-lg border border-[#DFCBB0] shadow-2xs">
              <span className="text-[11px] text-[#78716C] px-2 font-medium hidden sm:inline">
                Columns:
              </span>
              <button
                onClick={() => setColumnLayout('4-col')}
                className={`px-2.5 py-1 text-xs rounded font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  columnLayout === '4-col'
                    ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF7F2]'
                }`}
                title="4-Column Grid View"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span className="text-[11px]">4 Col</span>
              </button>

              <button
                onClick={() => setColumnLayout('3-col')}
                className={`px-2.5 py-1 text-xs rounded font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                  columnLayout === '3-col'
                    ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF7F2]'
                }`}
                title="3-Column Gallery View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px]">3 Col</span>
              </button>
            </div>

            {/* Adjustable Spacing Density Toggle */}
            <div className="flex items-center bg-white p-1 rounded-lg border border-[#DFCBB0] shadow-2xs">
              <span className="text-[11px] text-[#78716C] px-2 font-medium hidden sm:inline">
                Spacing:
              </span>
              <button
                onClick={() => setSpacingDensity('comfortable')}
                className={`px-2 py-1 text-[11px] rounded font-medium transition-all cursor-pointer ${
                  spacingDensity === 'comfortable'
                    ? 'bg-[#88672D] text-white shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
                title="Comfortable Spacious Layout"
              >
                Comfortable
              </button>
              <button
                onClick={() => setSpacingDensity('compact')}
                className={`px-2 py-1 text-[11px] rounded font-medium transition-all cursor-pointer ${
                  spacingDensity === 'compact'
                    ? 'bg-[#88672D] text-white shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
                title="Compact Grid Layout"
              >
                Compact
              </button>
            </div>

            {/* Complete Gallery Button */}
            <button
              onClick={onViewAll}
              className="text-xs font-bold uppercase tracking-widest bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer hover:scale-102"
            >
              <span>View All ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {CATEGORY_TABS.map(tab => {
            const count = tab.id === 'all' 
              ? products.length 
              : products.filter(p => p.category === tab.id).length;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#1C1917] text-white shadow-md border border-[#C5A059]'
                    : 'bg-white/80 text-[#57534E] hover:bg-white hover:text-[#1C1917] border border-[#DFCBB0]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-[#C5A059] text-[#1C1917] font-bold' : 'bg-[#EBDDC5] text-[#88672D]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid of Products with Adjustable Spacing & Columns */}
        <div className={`grid ${
          columnLayout === '4-col'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        } ${
          spacingDensity === 'comfortable' ? 'gap-6 sm:gap-7' : 'gap-4 sm:gap-4.5'
        }`}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Bottom Banner with Quick WhatsApp Link to Salman Khan */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white border border-[#DFCBB0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C5A059] flex items-center justify-center text-[#88672D] flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1C1917]">
                Seeking a Specific Era or Custom Color Palette?
              </h4>
              <p className="text-xs text-[#78716C] font-light">
                Curator Salman Khan provides personal advisory for bespoke commissions and antique valuations.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/923149281875?text=Hello%20Salman%20Khan,%20I%20am%20inquiring%20about%20a%20specific%20antique%20or%20bespoke%20resin%20piece."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#1C1917] hover:bg-[#2C2723] text-white text-xs font-semibold tracking-wider uppercase rounded-lg transition-all flex items-center space-x-2 flex-shrink-0 shadow-xs cursor-pointer hover:scale-102"
          >
            <span>Consult Salman Khan</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
          </a>
        </div>

      </div>
    </section>
  );
};
