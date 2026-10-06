import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Heart,
  Check
} from 'lucide-react';
import { StoreService } from '../services/store';

interface FooterProps {
  onNavigate: (view: 'home' | 'shop' | 'one-of-a-kind' | 'custom' | 'about') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const settings = StoreService.getSettings();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#181513] text-[#FAF7F2] pt-16 pb-12 border-t border-[#2C2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Callout Banner */}
        <div className="bg-[#241F1C] rounded-2xl p-6 sm:p-10 border border-[#3A332C] mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-[#C5A059] text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Privileged Patron Circle</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              Receive Invitations to Private Salons &amp; Releases
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A29E] font-light">
              Subscribe to enjoy a 10% welcome consideration code (<strong>HERITAGE10</strong>) toward your premier acquisition.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#C5A059]" />
                <span>Welcome to the circle! Use code <strong>HERITAGE10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-[#181513] border border-[#3A332C] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#88672D] hover:bg-[#9B783E] text-white text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors"
                >
                  Join Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4-Column Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2C2723] text-xs text-[#A8A29E]">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-white block">
                Gulrang <span className="text-[#C5A059] italic font-normal">Antique</span>
              </span>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#C5A059] mt-0.5">
                Curated by Salman Khan • Bespoke Atelier
              </p>
            </div>
            <p className="text-xs text-[#A8A29E] leading-relaxed font-light">
              We bridge organic botanicals, liquid amber resin, and genuine historic heirlooms to honor enduring domestic elegance across generations.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#C5A059]">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Authenticity Guarantee</span>
            </div>
          </div>

          {/* Col 2: Collections & Portfolios */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
              Atelier Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Botanical Resin Salvers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('one-of-a-kind')} className="hover:text-white transition-colors flex items-center space-x-1">
                  <span>One-of-a-Kind Artifacts</span>
                  <span className="text-[9px] bg-[#88672D] text-white px-1.5 py-0.2 rounded">1-of-1</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  19th Century Antique Decor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Gilded Acanthus Plaques
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom')} className="hover:text-white transition-colors">
                  Bespoke Preservation Commission
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Patron Services */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
              Patron Services
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="hover:text-white cursor-pointer">Insured White-Glove Shipping</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Resin Care &amp; Polish Guide</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Certificate of Provenance Verification</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Bridal Trousseau Preservation</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Corporate Architectural Gifting</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Curatorial Gallery Info */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
              Atelier Address
            </h4>
            <div className="space-y-2.5 text-xs text-[#A8A29E]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <span>Mon – Sat: 11:00 AM – 8:00 PM PKT</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Gateways, Admin trigger & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-[#A8A29E]">Secured Gateways:</span>
            <span className="px-2 py-0.5 bg-[#241F1C] border border-[#3A332C] rounded text-[10px] text-white">COD</span>
            <span className="px-2 py-0.5 bg-[#241F1C] border border-[#3A332C] rounded text-[10px] text-white">JazzCash</span>
            <span className="px-2 py-0.5 bg-[#241F1C] border border-[#3A332C] rounded text-[10px] text-white">Easypaisa</span>
            <span className="px-2 py-0.5 bg-[#241F1C] border border-[#3A332C] rounded text-[10px] text-white">Meezan IBFT</span>
            <span className="px-2 py-0.5 bg-[#241F1C] border border-[#3A332C] rounded text-[10px] text-white">Visa / MC</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAdmin}
              className="text-[#C5A059] hover:underline text-xs flex items-center space-x-1 font-mono"
            >
              <span>Atelier Management Portal</span>
            </button>
            <span>•</span>
            <p className="text-xs">
              &copy; {new Date().getFullYear()} {settings.businessName}. All Rights Reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
