import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Product } from '../types';
import { SupportedCurrency, formatCurrency } from '../utils/currency';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: SupportedCurrency;
  onSelectProduct: (product: Product) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const popularSearches = [
    "Golden Botanical Resin Plate",
    "1890s Venetian Salver",
    "Pressed Flora Tray",
    "Florentine Acanthus Plaque",
    "Brass Lotus Bowl"
  ];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query, products]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#DFD1BD] z-10 overflow-hidden">
        
        {/* Search Input */}
        <div className="p-4 border-b border-[#E7DFD3] flex items-center space-x-3 bg-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#88672D] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search by antique piece, dried flower, brass, SKU..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#1C1917] placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-black">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border rounded text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results or Suggestions */}
        <div className="p-5 max-h-96 overflow-y-auto">
          {query.trim() ? (
            results.length > 0 ? (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-2">
                  Matching Artifacts ({results.length})
                </span>
                {results.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#DFCBB0] cursor-pointer flex items-center space-x-3 transition-colors"
                  >
                    <img src={p.images[0]} alt="" className="w-12 h-12 rounded object-cover bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-serif text-sm font-semibold text-[#1C1917] truncate">{p.name}</h4>
                        <span className="text-[10px] font-mono text-gray-400">{p.sku}</span>
                      </div>
                      <span className="text-xs text-[#78716C] line-clamp-1">{p.material}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-serif font-bold text-sm text-[#1C1917]">
                        {formatCurrency(p.salePrice || p.price, currency)}
                      </span>
                      <span className="text-[10px] text-[#88672D] block uppercase">{p.condition}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#78716C] text-xs">
                <p>No matching artifacts found for "{query}".</p>
                <p className="mt-1 text-[11px]">Try searching for "resin", "tray", "gold", or "plate".</p>
              </div>
            )
          ) : (
            <div className="space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD3] text-xs text-[#57534E] hover:border-[#88672D] hover:text-[#1C1917] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
