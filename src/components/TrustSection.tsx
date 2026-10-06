import React from 'react';
import { ShieldCheck, PackageCheck, Truck, Headphones } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      badgeBg: "bg-amber-100/80 border-amber-300",
      title: "100% Certified Authentic",
      desc: "Every antique features verified provenance; all resin art plates are cast with genuine organic botanicals."
    },
    {
      icon: <PackageCheck className="w-5 h-5 text-emerald-600" />,
      badgeBg: "bg-emerald-100/80 border-emerald-300",
      title: "White-Glove Packaging",
      desc: "Delivered in bespoke velvet-lined cases and shock-absorbent crates engineered for heirloom preservation."
    },
    {
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      badgeBg: "bg-blue-100/80 border-blue-300",
      title: "Insured Courier Transit",
      desc: "Nationwide delivery across Pakistan via TCS & Leopards, with live SMS tracking and signature verification."
    },
    {
      icon: <Headphones className="w-5 h-5 text-rose-600" />,
      badgeBg: "bg-rose-100/80 border-rose-300",
      title: "Atelier Concierge Support",
      desc: "Direct guidance via phone or WhatsApp for sizing, custom wedding commissions, and staging tips."
    }
  ];

  return (
    <section className="py-12 sm:py-14 bg-[#F5EFEB] border-t border-[#E7DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-start space-y-3 p-5 rounded-2xl bg-white border border-[#E2D6C3] shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className={`p-2.5 rounded-xl border ${p.badgeBg} shadow-2xs`}>
                {p.icon}
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#1C1917]">
                  {p.title}
                </h4>
                <p className="text-xs text-[#57534E] leading-relaxed font-light mt-1">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
