import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, ArrowRight, Award, Compass, ChevronLeft, ChevronRight, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSectionProps {
  onShopClick?: () => void;
  onOneOfAKindClick?: () => void;
  onCustomClick?: () => void;
  onExplore?: () => void;
  onCustomOrder?: () => void;
}

const HERO_SHOWCASE_ITEMS = [
  {
    id: "hero-1",
    title: "Golden Botanical Resin Decorative Plate",
    subtitle: "Preserved white orchids, 24K gold flakes, optical clarity bio-epoxy",
    badge: "Featured Atelier Masterpiece",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85",
    provenance: "Gulberg III Atelier • Hand-poured by Salman Khan",
    priceTag: "PKR 32,500"
  },
  {
    id: "hero-2",
    title: "Mughal Damascene Hand-Hammered Brass Samovar",
    subtitle: "Circa 1890 authentic antique brass relic with hand-chiseled floral arabesques",
    badge: "1-of-1 Certified Antique",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=85",
    provenance: "Old City Lahore Provenance • Historical Vault",
    priceTag: "PKR 58,000"
  },
  {
    id: "hero-3",
    title: "Celestial Botanical Wall Clock & Salver",
    subtitle: "Natural quartz crystal points, wild ivy pressings & silent German movement",
    badge: "Signature Collection",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1200&q=85",
    provenance: "Bespoke Horology Studio • 18\" Diameter",
    priceTag: "PKR 28,000"
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onOneOfAKindClick,
  onCustomClick,
  onExplore,
  onCustomOrder
}) => {
  const handleShop = onShopClick || onExplore;
  const handleUnique = onOneOfAKindClick || onExplore;
  const handleCustom = onCustomClick || onCustomOrder;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SHOWCASE_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeItem = HERO_SHOWCASE_ITEMS[currentIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6EE] via-[#F8F2E7] to-[#F5EEE2] border-b border-[#E7DFD3]">
      {/* Subtle decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E5D7C0]/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#DFCBB0] text-[#88672D] text-xs tracking-wider uppercase font-semibold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Gulrang Antique • Salman Khan Curator</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#1C1917] leading-[1.12]">
              Discover Art That <br />
              <span className="italic font-normal text-[#9B783E]">Tells a Story</span>
            </h1>

            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-xl font-light">
              Welcome to <strong>Gulrang Antique</strong>, curated by <strong>Salman Khan</strong>. Handcrafted botanical resin treasures, certified antique relics, and bespoke wedding bouquet preservation.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="hero-shop-btn"
                onClick={handleShop}
                className="px-7 py-3.5 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs sm:text-sm font-semibold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-md hover:shadow-xl flex items-center space-x-2 cursor-pointer border border-[#1C1917]"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="hero-unique-btn"
                onClick={handleUnique}
                className="px-7 py-3.5 bg-white hover:bg-[#F3ECE0] text-[#1C1917] border border-[#C5A059] text-xs sm:text-sm font-semibold tracking-widest uppercase rounded-lg transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>One-of-a-Kind Vault</span>
              </motion.button>

              <a
                href="https://wa.me/923149281875?text=Hello%20Salman%20Khan,%20I%20am%20interested%20in%20inquiring%20about%20a%20Gulrang%20Antique%20piece."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-[#88672D] hover:text-[#1C1917] font-semibold tracking-wider uppercase py-2.5 px-3.5 rounded-lg bg-white/60 hover:bg-white border border-[#DFCBB0] transition-colors shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#059669]" />
                <span>+92 314 9281875</span>
              </a>
            </div>

            {/* Micro Highlights with Colored Badges */}
            <div className="pt-6 border-t border-[#E7DFD3] grid grid-cols-3 gap-3 text-[#57534E]">
              <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/60 border border-[#E7DFD3]/60">
                <div className="p-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-700 flex-shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1C1917]">100% Certified</div>
                  <div className="text-[10px] text-[#78716C] truncate">Authentic Provenance</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/60 border border-[#E7DFD3]/60">
                <div className="p-1.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-700 flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1C1917]">Museum Grade</div>
                  <div className="text-[10px] text-[#78716C] truncate">UV Cast Bio-Resin</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/60 border border-[#E7DFD3]/60">
                <div className="p-1.5 rounded-lg bg-blue-100 border border-blue-300 text-blue-700 flex-shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1C1917]">Custom Orders</div>
                  <div className="text-[10px] text-[#78716C] truncate">Tailored Commissions</div>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Hero Visual Collage with Animated Rotating Showcase */}
          <div 
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Luxury Product Showcase Image with AnimatePresence */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-[#FAF7F2] min-h-[420px] sm:min-h-[460px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative w-full h-[420px] sm:h-[460px]"
                  >
                    <img 
                      src={activeItem.image} 
                      alt={activeItem.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Overlaid Badge */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-1.5 text-[11px] tracking-widest uppercase text-[#E8DCC4] font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{activeItem.badge}</span>
                        </div>
                        <span className="font-serif font-bold text-sm text-[#C5A059] bg-black/60 px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 backdrop-blur-xs">
                          {activeItem.priceTag}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">
                        {activeItem.title}
                      </h3>
                      <p className="text-xs text-[#E8DCC4] line-clamp-1 font-light mt-0.5">
                        {activeItem.subtitle}
                      </p>
                      <div className="text-[10px] text-stone-300 mt-1 italic">
                        {activeItem.provenance}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="absolute top-4 right-4 flex items-center space-x-1.5 z-20 bg-black/50 backdrop-blur-xs p-1 rounded-full border border-white/20">
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + HERO_SHOWCASE_ITEMS.length) % HERO_SHOWCASE_ITEMS.length)}
                    className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                    title="Previous artifact"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex space-x-1 px-1">
                    {HERO_SHOWCASE_ITEMS.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${idx === currentIndex ? 'bg-[#C5A059] w-4' : 'bg-white/50 w-2'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % HERO_SHOWCASE_ITEMS.length)}
                    className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                    title="Next artifact"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Floating Miniature Card */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-[#DFCBB0] max-w-[210px] hidden sm:block z-20"
              >
                <div className="flex items-center space-x-2 text-[#C5A059] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#1C1917]">Hand-Signed Authenticity</span>
                </div>
                <p className="text-[11px] text-[#57534E] leading-snug font-light">
                  Every heirloom certified by curator Salman Khan.
                </p>
              </motion.div>

              {/* Commission Prompt pill */}
              <motion.div 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleCustom}
                className="cursor-pointer absolute -top-3.5 -right-2 sm:-right-3 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C378] text-[#1C1917] px-3.5 py-2 rounded-xl shadow-lg font-bold text-xs flex items-center space-x-1.5 transition-all z-20 border border-white/40"
              >
                <span>Bespoke Commission</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#1C1917]" />
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
