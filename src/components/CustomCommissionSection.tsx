import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  UploadCloud, 
  Calendar, 
  Clock, 
  Palette, 
  Calculator, 
  Check, 
  ArrowRight, 
  MessageSquare, 
  X, 
  ShieldCheck 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StoreService } from '../services/store';

interface CustomCommissionSectionProps {
  onInquirySubmitted?: (ticketNumber: string) => void;
}

export const CustomCommissionSection: React.FC<CustomCommissionSectionProps> = ({
  onInquirySubmitted
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [ticketNum, setTicketNum] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Live Estimator State
  const [estimatorSize, setEstimatorSize] = useState<'10' | '14' | '18' | '24'>('14');
  const [includeGoldLeaf, setIncludeGoldLeaf] = useState(true);
  const [includeCalligraphy, setIncludeCalligraphy] = useState(false);
  const [standType, setStandType] = useState<'sheesham' | 'brass' | 'acrylic'>('sheesham');

  // Calculate live estimation
  const baseSizePrice = {
    '10': 16000,
    '14': 26000,
    '18': 38000,
    '24': 58000
  }[estimatorSize];

  const goldPrice = includeGoldLeaf ? 4500 : 0;
  const calligraphyPrice = includeCalligraphy ? 5000 : 0;
  const standPrice = standType === 'brass' ? 6500 : standType === 'sheesham' ? 3500 : 1500;

  const estimatedTotal = baseSizePrice + goldPrice + calligraphyPrice + standPrice;
  const estimatedDays = estimatorSize === '10' ? '6-8' : estimatorSize === '14' ? '8-12' : estimatorSize === '18' ? '12-16' : '18-24';

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    productType: 'Resin Decorative Plate with Preserved Flowers',
    description: '',
    preferredSize: '14" Diameter (Standard)',
    preferredColors: 'Ivory, Champagne & 24K Gold Leaf',
    material: 'Bio-Resin & Preserved Botanicals',
    budget: 'PKR 25,000 - 45,000',
    requiredDate: ''
  });

  const handleApplyEstimator = () => {
    const sizeName = estimatorSize === '10' ? '10" Petite Plate' : estimatorSize === '14' ? '14" Standard Plate' : estimatorSize === '18' ? '18" Grand Salver' : '24" Tabletop Plaque';
    const standName = standType === 'brass' ? 'Cast Brass Mount' : standType === 'sheesham' ? 'Solid Sheesham Stand' : 'Acrylic Easel';
    const additions = [
      includeGoldLeaf ? '24K Gold Flakes' : null,
      includeCalligraphy ? 'Custom Arabic/English Calligraphy' : null,
      standName
    ].filter(Boolean).join(', ');

    setFormData(prev => ({
      ...prev,
      preferredSize: sizeName,
      budget: `PKR ${estimatedTotal.toLocaleString()}`,
      description: (prev.description ? prev.description + '\n' : '') + `[Live Config]: ${sizeName} with ${additions}. Estimated timeline: ${estimatedDays} days.`
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.description) return;

    const newReq = StoreService.createCustomOrder({
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      productType: formData.productType,
      description: formData.description + (uploadedImage ? ' [Attached reference photo]' : ''),
      preferredSize: formData.preferredSize,
      preferredColors: formData.preferredColors,
      material: formData.material,
      budget: formData.budget,
      requiredDate: formData.requiredDate || 'Flexible'
    });

    setTicketNum(newReq.ticketNumber);
    setSubmitted(true);
    if (onInquirySubmitted) {
      onInquirySubmitted(newReq.ticketNumber);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2] border-t border-[#E7DFD3]" id="custom-commission-anchor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE0] border border-[#DFCBB0] text-[#88672D] text-xs tracking-wider uppercase font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Gulrang Antique Bespoke Atelier</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1C1917] leading-tight">
            Commission a Singular <span className="italic font-normal text-[#C5A059]">Masterpiece</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059] mx-auto mt-3 mb-3" />
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-light">
            Preserve your wedding florals, design customized heirloom calligraphy plaques, or commission hand-engraved antique salvers directly with curator Salman Khan.
          </p>
        </div>

        {/* Two Columns: Live Interactive Estimator (Left) + Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Column: Live Interactive Price & Specs Estimator */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl border border-[#DFD1BD] p-4 sm:p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#F3ECE0] pb-3">
                <div className="flex items-center space-x-2 text-[#88672D]">
                  <Calculator className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs font-bold tracking-wider uppercase">Live Specification Estimator</span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-[#78716C] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E7DFD3]">
                  Real-time
                </span>
              </div>

              {/* Diameter / Size Options */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-2">
                  1. Plaque / Plate Diameter
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-2">
                  {(['10', '14', '18', '24'] as const).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setEstimatorSize(size)}
                      className={`min-h-[48px] py-2.5 px-2 text-center rounded-lg text-xs font-semibold transition-all ${
                        estimatorSize === size
                          ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                          : 'bg-[#FAF7F2] text-[#57534E] border border-[#E7DFD3] hover:border-[#C5A059]'
                      }`}
                    >
                      <span className="text-sm sm:text-xs block font-bold">{size}&quot;</span>
                      <span className="block text-[10px] sm:text-[9px] font-normal opacity-85 mt-0.5">
                        {size === '10' ? 'Petite' : size === '14' ? 'Standard' : size === '18' ? 'Grand' : 'Salon'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Artisan Inclusions Toggle */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-2">
                  2. Embellishments &amp; Curation
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-lg bg-[#FAF7F2] border border-[#E7DFD3] cursor-pointer hover:border-[#DFCBB0] min-h-[46px]">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={includeGoldLeaf}
                        onChange={e => setIncludeGoldLeaf(e.target.checked)}
                        className="w-4 h-4 rounded text-[#88672D] focus:ring-[#C5A059]"
                      />
                      <span className="text-xs sm:text-sm text-[#1C1917] font-medium">24K Gold Leaf Foil Suspension</span>
                    </div>
                    <span className="text-xs text-[#88672D] font-mono font-semibold whitespace-nowrap ml-2">+PKR 4,500</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg bg-[#FAF7F2] border border-[#E7DFD3] cursor-pointer hover:border-[#DFCBB0] min-h-[46px]">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={includeCalligraphy}
                        onChange={e => setIncludeCalligraphy(e.target.checked)}
                        className="w-4 h-4 rounded text-[#88672D] focus:ring-[#C5A059]"
                      />
                      <span className="text-xs sm:text-sm text-[#1C1917] font-medium">Hand-Inscribed Calligraphy / Ayat</span>
                    </div>
                    <span className="text-xs text-[#88672D] font-mono font-semibold whitespace-nowrap ml-2">+PKR 5,000</span>
                  </label>
                </div>
              </div>

              {/* Display Stand Option */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-2">
                  3. Handcrafted Display Stand
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'sheesham', label: 'Sheesham Wood', sub: 'Traditional Stand' },
                    { id: 'brass', label: 'Cast Brass', sub: 'Antique Mount' },
                    { id: 'acrylic', label: 'Crystal Easel', sub: 'Minimalist Mount' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStandType(item.id as any)}
                      className={`p-2.5 sm:p-2 text-center rounded-lg text-xs font-medium transition-all min-h-[44px] ${
                        standType === item.id
                          ? 'bg-[#88672D] text-white shadow-xs'
                          : 'bg-[#FAF7F2] text-[#57534E] border border-[#E7DFD3] hover:border-[#C5A059]'
                      }`}
                    >
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-[10px] sm:text-[9px] opacity-85 mt-0.5">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Calculated Output Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#1C1917] to-[#2C2723] text-white space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">Estimated Atelier Cost:</span>
                  <span className="font-serif text-2xl font-bold text-[#FAF7F2]">
                    PKR {estimatedTotal.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#DFCBB0] border-t border-white/10 pt-2 font-light">
                  <div>
                    <span className="block text-[10px] uppercase text-[#A8A29E]">Pour &amp; Curing Time</span>
                    <strong>{estimatedDays} Working Days</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-[#A8A29E]">Resin Grade</span>
                    <strong>UV-Resistant Bio-Cast</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyEstimator}
                  className="w-full py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#1C1917] font-semibold text-xs tracking-wider uppercase rounded transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Estimate to Form</span>
                </button>
              </div>

            </div>

            {/* Atelier Process Commitments */}
            <div className="p-5 bg-white/70 rounded-xl border border-[#E7DFD3] space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#1C1917]">
                <ShieldCheck className="w-4 h-4 text-[#88672D]" />
                <span>The Gulrang Atelier Guarantee</span>
              </div>
              <ul className="text-xs text-[#57534E] space-y-1.5 font-light list-disc pl-4 leading-relaxed">
                <li>Direct consultation with Salman Khan before resin pour.</li>
                <li>Digital mockup provided for approval within 24 hours.</li>
                <li>Multi-stage degassing eliminates bubbles for diamond clarity.</li>
                <li>Complimentary insured wooden crating across Pakistan.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Custom Commission Request Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DFD1BD] p-4 sm:p-8 md:p-10 shadow-lg">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 sm:py-10 space-y-5"
              >
                <div className="w-16 h-16 bg-[#F3ECE0] text-[#88672D] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                  Commission Logged With Atelier
                </h3>

                <p className="text-sm text-[#57534E] max-w-md mx-auto font-light leading-relaxed">
                  Thank you, <strong className="font-semibold text-[#1C1917]">{formData.customerName}</strong>. Your custom inquiry has been entered into the Gulrang master register under ticket:
                </p>

                <div className="inline-block px-6 py-3 bg-[#FAF7F2] border-2 border-[#DFCBB0] rounded-xl font-mono text-lg font-bold text-[#88672D] shadow-xs">
                  {ticketNum}
                </div>

                <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                  Curator Salman Khan has been notified. You can chat immediately on WhatsApp with your ticket code for swift dispatch and botanical advice:
                </p>

                {/* Instant WhatsApp Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/923149281875?text=Hello%20Salman%20Khan,%20I%20have%20submitted%20commission%20ticket%20${ticketNum}%20for%20${encodeURIComponent(formData.productType)}.%20Customer:%20${encodeURIComponent(formData.customerName)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs font-semibold tracking-wider uppercase rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md min-h-[46px]"
                  >
                    <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                    <span>Send Ticket to Salman Khan on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setUploadedImage(null);
                      setFormData({
                        customerName: '',
                        phone: '',
                        email: '',
                        productType: 'Resin Decorative Plate with Preserved Flowers',
                        description: '',
                        preferredSize: '14" Diameter (Standard)',
                        preferredColors: 'Ivory, Champagne & 24K Gold Leaf',
                        material: 'Bio-Resin & Preserved Botanicals',
                        budget: 'PKR 25,000 - 45,000',
                        requiredDate: ''
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 bg-[#FAF7F2] hover:bg-[#EBDDC5] text-[#1C1917] border border-[#DFCBB0] text-xs font-semibold tracking-wider uppercase rounded-lg transition-all min-h-[46px]"
                  >
                    Create Another Commission
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="border-b border-[#F3ECE0] pb-3 sm:pb-4">
                  <h3 className="text-xl font-serif font-semibold text-[#1C1917]">
                    Custom Project Consultation
                  </h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Share your requirements, dried florals, or celebration details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Ayesha Siddiqui"
                      value={formData.customerName}
                      onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone *
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="+92 314 9281875"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input 
                      type="email"
                      placeholder="patron@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                      Product Type
                    </label>
                    <select
                      value={formData.productType}
                      onChange={e => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                    >
                      <option value="Resin Decorative Plate with Preserved Flowers">Resin Decorative Floral Plate</option>
                      <option value="Wedding Floral Bouquet Keepsake Plaque">Wedding Garland / Bouquet Keepsake</option>
                      <option value="Personalized Arabic / English Calligraphy Plaque">Calligraphy Name Plaque</option>
                      <option value="Custom Decorative Serving Tray with Brass Handles">Decorative Serving Tray</option>
                      <option value="Bespoke Wall Clock with Geode & Gold">Geode Botanical Wall Clock</option>
                      <option value="Corporate Trophy / Luxury Gift">Corporate / VIP Gift Set</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                      Preferred Size
                    </label>
                    <input
                      type="text"
                      value={formData.preferredSize}
                      onChange={e => setFormData({ ...formData, preferredSize: e.target.value })}
                      placeholder="e.g. 14 inch diameter"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                      Target Budget
                    </label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={e => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g. PKR 30,000"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                      Required By Date
                    </label>
                    <input 
                      type="date"
                      value={formData.requiredDate}
                      onChange={e => setFormData({ ...formData, requiredDate: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] min-h-[46px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
                    Design Vision &amp; Inscription Instructions *
                  </label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Describe specific flowers, gold leaf placement, names/dates to engrave, or reference themes..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] leading-relaxed focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                {/* Upload reference photo with live thumbnail preview */}
                <div className="p-4 border-2 border-dashed border-[#DFCBB0] rounded-xl bg-[#FAF7F2] text-center">
                  {uploadedImage ? (
                    <div className="relative inline-block">
                      <img 
                        src={uploadedImage} 
                        alt="Reference upload preview" 
                        className="h-24 w-24 object-cover rounded-lg border border-[#DFCBB0] shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="absolute -top-2 -right-2 p-1.5 bg-[#1C1917] text-white rounded-full hover:bg-red-600 transition-colors shadow-xs"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-xs text-[#88672D] font-medium mt-1.5">Reference image attached</p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-7 h-7 text-[#88672D] mx-auto mb-1.5" />
                      <span className="text-xs sm:text-sm font-medium text-[#1C1917] block">
                        Attach Reference Photos or Bouquet Samples
                      </span>
                      <p className="text-[11px] text-[#78716C] mt-0.5">
                        Supports JPG, PNG or WEBP photos
                      </p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        id="custom-order-upload" 
                      />
                      <label 
                        htmlFor="custom-order-upload"
                        className="mt-3 inline-flex items-center justify-center px-4 py-2 bg-white border border-[#DFCBB0] text-xs font-semibold text-[#88672D] rounded-lg cursor-pointer hover:bg-[#F3ECE0] transition-colors min-h-[40px] shadow-xs"
                      >
                        Select Image
                      </label>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs sm:text-sm font-semibold tracking-widest uppercase rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer min-h-[50px]"
                >
                  <Send className="w-4 h-4 text-[#C5A059]" />
                  <span>Submit Custom Commission to Atelier</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
