import React from 'react';
import { Sparkles, Award, ShieldCheck, Heart, Clock, Compass } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="bg-[#FAF7F2] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#88672D] font-bold">
            The Atelier Legacy &amp; Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#1C1917] leading-tight">
            Where Historic Grandeur Encounters Botanical Alchemy
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-light">
            Founded in the cultural heart of Lahore, <strong>Gulrang Antique</strong> was conceived by curator <strong>Salman Khan</strong> out of reverence for timeless domestic aesthetics. We pair centuries-old European and South Asian decorative craftsmanship with contemporary botanical resin preservation.
          </p>
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80" 
              alt="Artisan casting botanical resin" 
              className="w-full h-[450px] object-cover rounded-2xl shadow-xl border border-[#DFD1BD]"
            />
            <div className="absolute -bottom-6 -right-6 hidden sm:block bg-[#1C1917] text-[#FAF7F2] p-6 rounded-xl max-w-xs shadow-2xl border border-[#3E3833]">
              <span className="text-[#C5A059] font-serif text-3xl font-bold block">100%</span>
              <p className="text-xs text-[#D5C7B0] mt-1">
                Hand-harvested botanicals encased in optical-grade, UV-inhibited casting resins.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#88672D] font-bold">Our Philosophy</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                Artifacts Destined to Become Tomorrow's Heirlooms
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              Every botanical salver begins in pristine organic gardens. Blooms of larkspur, wild chamomile, and tea roses are harvested at peak dew and pressed using heirloom parchment presses for 28 days.
            </p>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              Our master artisans pour clear bio-resins in micro-layers over several days, suspending delicate flora in three-dimensional suspension and garnishing the borders with genuine 24-karat gold leaf flakes.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E7DFD3]">
              <div>
                <h4 className="font-serif font-semibold text-[#1C1917] text-sm">Certified Provenance</h4>
                <p className="text-xs text-[#78716C] mt-1">Every antique and one-of-a-kind creation is stamped and cataloged.</p>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-[#1C1917] text-sm">Museum Longevity</h4>
                <p className="text-xs text-[#78716C] mt-1">UV-stabilized formulation resists ambering for decades.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="bg-white p-8 rounded-2xl border border-[#DFD1BD] space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#DFCBB0] flex items-center justify-center text-[#88672D]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#1C1917]">Artisanal Handcrafting</h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Never factory manufactured. Each piece bears the gentle nuances of human touch and natural botanical variation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#DFD1BD] space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#DFCBB0] flex items-center justify-center text-[#88672D]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#1C1917]">Antique Authenticity</h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Original Victorian, Edwardian, and Rajasthani brassware hand-curated and authenticated by certified decorative appraisers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#DFD1BD] space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#DFCBB0] flex items-center justify-center text-[#88672D]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#1C1917]">Bespoke Memory Keeping</h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Preserving bridal trousseau bouquets, anniversary blooms, and familial heirlooms in luminous permanence.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
