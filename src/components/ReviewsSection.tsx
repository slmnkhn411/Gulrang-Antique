import React, { useState } from 'react';
import { Star, ShieldCheck, Sparkles, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/initialData';

const PATRON_REVIEWS = [
  {
    ...INITIAL_REVIEWS[0],
    city: "Gulberg, Lahore",
    piece: "Golden Botanical Resin Decorative Salver",
    badge: "VIP Collector"
  },
  {
    ...INITIAL_REVIEWS[1],
    city: "F-7, Islamabad",
    piece: "Mughal Damascene Brass Samovar",
    badge: "Heirloom Connoisseur"
  },
  {
    ...INITIAL_REVIEWS[2],
    city: "Kensington, London",
    piece: "Antique Chased Brass Water Ewer",
    badge: "International Patron"
  },
  {
    ...INITIAL_REVIEWS[3],
    city: "Clifton, Karachi",
    piece: "Wildflower Botanical Vanity Tray",
    badge: "Verified Buyer"
  }
];

export const ReviewsSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2] border-b border-[#E7DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE0] border border-[#DFCBB0] text-[#88672D] text-xs tracking-wider uppercase font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Patron Accolades &amp; Provenance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
            Words from Discerning Collectors
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059] mx-auto mt-3 mb-3" />
          <p className="text-xs sm:text-sm text-[#78716C] font-light">
            Read testimonials from collectors and families across Pakistan and abroad whose homes are graced by Gulrang Antique heirlooms.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PATRON_REVIEWS.map((review, idx) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-[#E7DFD3] hover:border-[#C5A059] transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500 space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-[#C5A059]" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {review.badge}
                  </span>
                </div>

                {/* Quote Text */}
                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-[#C5A059]/25 absolute -top-2 -left-1 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-light italic pl-4">
                    "{review.comment}"
                  </p>
                </div>
              </div>

              {/* Patron Info */}
              <div className="pt-4 border-t border-[#F3ECE0]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-semibold text-sm text-[#1C1917]">
                      {review.customerName}
                    </h4>
                    <p className="text-[11px] text-[#78716C]">
                      {review.city}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-700 text-[11px] font-medium" title="Verified Acquisition">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-[#88672D] font-medium truncate">
                  Acquired: {review.piece}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Atelier Commitment Note */}
        <div className="mt-8 text-center text-xs text-[#78716C] font-light">
          <span>Every heirloom is personally inspected and certified by curator </span>
          <strong className="text-[#1C1917] font-semibold">Salman Khan</strong>
          <span> before insured transit.</span>
        </div>

      </div>
    </section>
  );
};
