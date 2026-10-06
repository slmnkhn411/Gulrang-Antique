import React from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

interface FeaturedCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

const CATEGORIES = [
  {
    name: "Resin Art",
    subtitle: "Floral botanical plates & clocks",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80",
    itemCount: "14 items",
    accentColor: "border-emerald-600",
    badgeBg: "bg-emerald-900/80 text-emerald-200 border-emerald-500/40",
    dotColor: "bg-emerald-500"
  },
  {
    name: "Decorative Plates",
    subtitle: "Artisan gold-leaf & botanical salvers",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    itemCount: "8 items",
    accentColor: "border-amber-600",
    badgeBg: "bg-amber-900/80 text-amber-200 border-amber-500/40",
    dotColor: "bg-amber-500"
  },
  {
    name: "Antique Décor",
    subtitle: "Hand-hammered brass & historic relics",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80",
    itemCount: "6 items",
    accentColor: "border-orange-600",
    badgeBg: "bg-orange-950/80 text-orange-200 border-orange-500/40",
    dotColor: "bg-orange-500"
  },
  {
    name: "Decorative Trays",
    subtitle: "Solid walnut & cast brass vanity trays",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    itemCount: "11 items",
    accentColor: "border-yellow-700",
    badgeBg: "bg-stone-900/80 text-amber-100 border-stone-600/40",
    dotColor: "bg-amber-600"
  },
  {
    name: "Wall Art",
    subtitle: "Classical mouldings & geode timepieces",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80",
    itemCount: "9 items",
    accentColor: "border-blue-600",
    badgeBg: "bg-blue-950/80 text-blue-200 border-blue-500/40",
    dotColor: "bg-blue-500"
  },
  {
    name: "Customized Gifts",
    subtitle: "Wedding memory & keepsake plaques",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80",
    itemCount: "Bespoke",
    accentColor: "border-rose-600",
    badgeBg: "bg-rose-950/80 text-rose-200 border-rose-500/40",
    dotColor: "bg-rose-500"
  }
];

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-10 sm:py-14 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE0] border border-[#DFCBB0] text-[#88672D] text-xs font-semibold tracking-widest uppercase mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Curated Disciplines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917] tracking-tight">
            Explore by Atelier Category
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059] mx-auto mt-2.5 mb-2.5" />
          <p className="text-xs sm:text-sm text-[#78716C] font-light">
            From rare antique brass vessels to contemporary bio-resin botanical salvers, each collection reflects timeless artisanal mastery.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`group cursor-pointer flex flex-col rounded-xl overflow-hidden bg-white border border-[#E7DFD3] hover:${cat.accentColor} transition-all duration-300 shadow-2xs hover:shadow-xl hover:-translate-y-1.5`}
            >
              <div className="relative h-44 sm:h-48 overflow-hidden bg-[#F3ECE0]">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                
                {/* Category Count Pill with color dot */}
                <div className="absolute top-2.5 left-2.5">
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase backdrop-blur-xs border shadow-xs ${cat.badgeBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.dotColor}`} />
                    <span>{cat.itemCount}</span>
                  </span>
                </div>

                {/* Name */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-sm sm:text-base font-serif font-bold text-white group-hover:text-[#F3ECE0] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 bg-[#FAF7F2] group-hover:bg-[#F5EEE3] flex items-center justify-between text-xs text-[#57534E] transition-colors">
                <span className="text-[11px] text-[#78716C] truncate">{cat.subtitle}</span>
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-[#DFCBB0] group-hover:border-[#C5A059] group-hover:bg-[#C5A059] transition-colors flex-shrink-0">
                  <ArrowRight className="w-3 h-3 text-[#88672D] group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
