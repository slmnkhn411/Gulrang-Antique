import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Award, ArrowRight, Eye, ChevronLeft, ChevronRight, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { SupportedCurrency, formatCurrency } from '../utils/currency';

interface OneOfAKindSectionProps {
  product?: Product;
  products?: Product[];
  currency: SupportedCurrency;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onViewProduct?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onViewAll?: () => void;
}

export const OneOfAKindSection: React.FC<OneOfAKindSectionProps> = ({
  product: singleProduct,
  products = [],
  currency,
  onViewProduct,
  onQuickView,
  onAddToCart,
  onBuyNow,
  onViewAll
}) => {
  const handleView = onQuickView || onViewProduct || (() => {});
  
  // Find all one-of-a-kind items or fallback
  const uniqueList = products.filter(p => p.isOneOfAKind);
  const items = uniqueList.length > 0 ? uniqueList : (singleProduct ? [singleProduct] : products.slice(0, 3));
  
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];
  const isSold = currentItem.stock <= 0 || currentItem.isSold;

  return (
    <section className="py-12 sm:py-16 bg-[#14110F] text-[#FAF7F2] border-y border-[#2D251D] relative overflow-hidden">
      {/* Luxurious ambient warm gold & amber backlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-80 h-80 bg-[#88672D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Carousel Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 border-b border-[#2D251D] pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2A221A] text-[#E5C378] border border-[#C5A059]/40 text-xs font-semibold uppercase tracking-wider mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Certified Singular Unicum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              One-of-a-Kind Curated Vault
            </h2>
            <p className="text-xs sm:text-sm text-[#A89F91] mt-1 font-light max-w-xl">
              Individual artifacts that cannot be duplicated. Hand-signed certificates of authenticity included with each piece.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {items.length > 1 && (
              <div className="flex items-center space-x-1 bg-[#201A15] p-1 rounded-full border border-[#3D3328]">
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
                  className="p-1.5 rounded-full text-[#A89F91] hover:text-white hover:bg-[#2F261E] transition-colors cursor-pointer"
                  title="Previous piece"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono font-bold px-2.5 text-[#E5C378]">
                  {currentIndex + 1} / {items.length}
                </span>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
                  className="p-1.5 rounded-full text-[#A89F91] hover:text-white hover:bg-[#2F261E] transition-colors cursor-pointer"
                  title="Next piece"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {onViewAll && (
              <button
                onClick={onViewAll}
                className="text-xs font-semibold text-[#E5C378] hover:text-white uppercase tracking-wider flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#C5A059]/30 hover:bg-[#251E18] transition-colors cursor-pointer"
              >
                <span>View Full Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Masterpiece Showcase Card */}
        <div className="bg-[#1C1714] rounded-2xl border border-[#3E3327] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gold corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C5A059]/10 to-transparent pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              
              {/* Visual Artifact Showcase */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-[#4A3E31] bg-black group">
                  <img 
                    src={currentItem.images[0]} 
                    alt={currentItem.name}
                    className={`w-full h-[360px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105 ${
                      isSold ? 'filter grayscale contrast-125' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-2">
                    {isSold ? (
                      <div className="px-3.5 py-1.5 bg-[#1C1917] text-white text-xs font-bold tracking-widest uppercase rounded shadow-lg border border-red-500/50">
                        SOLD — Acquired by Collector
                      </div>
                    ) : (
                      <div className="px-3.5 py-1.5 bg-gradient-to-r from-[#9B783E] to-[#C5A059] text-[#1C1917] text-xs font-bold tracking-wider uppercase rounded-full shadow-lg flex items-center space-x-1.5">
                        <Gem className="w-3 h-3 text-[#1C1917]" />
                        <span>Only 1 in Existence</span>
                      </div>
                    )}

                    <div className="px-2.5 py-0.5 bg-black/75 backdrop-blur-xs text-stone-300 text-[10px] font-mono rounded w-fit border border-white/15">
                      SKU: {currentItem.sku}
                    </div>
                  </div>

                  {/* Overlaid Provenance in Photo */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <p className="text-xs text-[#E8DCC4] font-light flex items-center space-x-1.5">
                      <Sparkles className="w-3 h-3 text-[#C5A059]" />
                      <span>Curated by Salman Khan • Gulrang Antique Vault</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Artifact Narrative & Curation Details */}
              <div className="lg:col-span-6 space-y-5">
                
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest">
                      {currentItem.category}
                    </span>
                    <span className="text-stone-500">•</span>
                    <span className="text-xs text-stone-400">
                      {currentItem.condition}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
                    {currentItem.name}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#C4B9AA] leading-relaxed font-light">
                  {currentItem.story || currentItem.description}
                </p>

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#382E23] text-xs">
                  {currentItem.provenance && (
                    <div>
                      <span className="text-stone-400 block uppercase text-[10px]">Provenance</span>
                      <strong className="text-[#FAF7F2]">{currentItem.provenance}</strong>
                    </div>
                  )}
                  {currentItem.dimensions && (
                    <div>
                      <span className="text-stone-400 block uppercase text-[10px]">Dimensions</span>
                      <strong className="text-[#FAF7F2]">{currentItem.dimensions}</strong>
                    </div>
                  )}
                  {currentItem.material && (
                    <div className="col-span-2">
                      <span className="text-stone-400 block uppercase text-[10px]">Artisanal Materials</span>
                      <strong className="text-[#FAF7F2]">{currentItem.material}</strong>
                    </div>
                  )}
                </div>

                {/* Guarantee Badges */}
                <div className="flex items-center space-x-5 text-xs text-[#A89F91]">
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Signed Certificate of Authenticity</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[#E5C378]">
                    <Award className="w-4 h-4" />
                    <span>Velvet Case Packaging</span>
                  </div>
                </div>

                {/* Valuation and Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 block font-semibold">
                      Artifact Valuation
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#E5C378]">
                      {formatCurrency(currentItem.price, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleView(currentItem)}
                      className="px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase border border-[#C5A059]/60 text-[#E5C378] hover:bg-[#C5A059]/15 transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Examine</span>
                    </button>

                    {!isSold ? (
                      <button
                        onClick={() => {
                          if (onBuyNow) {
                            onBuyNow(currentItem);
                          } else {
                            onAddToCart(currentItem);
                          }
                        }}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C378] text-[#1C1917] text-xs font-bold tracking-widest uppercase transition-all shadow-lg flex items-center space-x-2 cursor-pointer hover:scale-102"
                      >
                        <span>Acquire Now</span>
                        <ArrowRight className="w-4 h-4 text-[#1C1917]" />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-6 py-2.5 rounded-lg bg-stone-700 text-stone-400 text-xs font-semibold tracking-widest uppercase cursor-not-allowed"
                      >
                        Archived / Sold
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
