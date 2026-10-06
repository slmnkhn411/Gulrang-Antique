import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { StoreService } from '../services/store';
import { AtelierMapsGuide } from './AtelierMapsGuide';

export const ContactSection: React.FC = () => {
  const settings = StoreService.getSettings();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Artifact Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#88672D] font-bold">
            Atelier Concierge &amp; Salon
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            Connect with Our Curators
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E]">
            Whether you seek provenance guidance, corporate gifting packages, or an appointment at our Lahore salon, our curators await your inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details Card */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#DFD1BD] space-y-8 shadow-xs">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">
                Gulrang Antique Atelier
              </h3>
              <p className="text-xs text-[#78716C]">
                Curated by Salman Khan • Private appointments available Tuesday through Saturday.
              </p>
            </div>

            <div className="space-y-5 text-xs text-[#57534E]">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#88672D] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1C1917] mb-0.5">Gallery &amp; Casting Studio:</strong>
                  <span>{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#88672D] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1C1917] mb-0.5">Patron Concierge Line (Salman Khan):</strong>
                  <span>{settings.phone}</span>
                  <span className="block text-[11px] text-[#78716C] mt-0.5">WhatsApp enabled for real-time video inspections</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#88672D] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1C1917] mb-0.5">Curatorial Correspondence:</strong>
                  <span>{settings.email}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#88672D] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1C1917] mb-0.5">Salon Visiting Hours:</strong>
                  <span>Monday – Saturday: 11:00 AM – 8:00 PM PKT</span>
                  <span className="block text-[#78716C]">Sunday: By advance VIP appointment only</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F3ECE0]">
              <a
                href="https://wa.me/923149281875?text=Hello%20Salman%20Khan%20at%20Gulrang%20Antique,%20I%20would%20like%20to%20inquire%20about%20a%20piece."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs font-semibold tracking-wider uppercase rounded-lg flex items-center justify-center space-x-2 transition-colors min-h-[46px]"
              >
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                <span>Instant WhatsApp Concierge (+92 314 9281875)</span>
              </a>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-white p-5 sm:p-10 rounded-2xl border border-[#DFD1BD] shadow-xs">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">Inquiry Dispatched</h3>
                <p className="text-xs text-[#57534E] max-w-sm mx-auto">
                  Thank you, {form.name}. A senior curator will review your note and respond within 12 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', subject: 'Artifact Inquiry', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 text-xs uppercase font-semibold text-[#88672D] hover:underline min-h-[44px] cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif text-xl font-semibold text-[#1C1917] mb-2">
                  Send a Direct Message
                </h3>

                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhan Qureshi"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] min-h-[44px] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1C1917] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] min-h-[44px] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1C1917] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                      Mobile / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+92 3XX XXXXXXX"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] min-h-[44px] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Inquiry Nature
                  </label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] min-h-[44px] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option>Artifact Inquiry</option>
                    <option>Bespoke Commission Consultation</option>
                    <option>Lahore Gallery Private Viewing</option>
                    <option>Corporate Architectural Gifting</option>
                    <option>Antique Authentication Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1C1917] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the piece you are interested in or your bespoke requirements..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E7DFD3] rounded-lg text-base sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#88672D] hover:bg-[#9B783E] text-white text-xs font-semibold uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 min-h-[48px] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Live Google Maps Grounded Atelier Guide & Regional Explorer */}
        <div id="atelier-maps-guide" className="pt-4">
          <AtelierMapsGuide />
        </div>

      </div>
    </div>
  );
};
