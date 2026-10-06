import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  RotateCcw, 
  Share2, 
  Check, 
  Clock, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin
} from 'lucide-react';
import { Product, Review } from '../types';
import { SupportedCurrency, formatCurrency } from '../utils/currency';
import { StoreService } from '../services/store';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currency: SupportedCurrency;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
  onSelectRelated?: (product: Product) => void;
  onSelectRelatedProduct?: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onSelectRelated,
  onSelectRelatedProduct,
  allProducts
}) => {
  if (!isOpen || !product) return null;

  const handleSelectRelated = onSelectRelatedProduct || onSelectRelated;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'care' | 'reviews'>('story');
  const [copiedLink, setCopiedLink] = useState(false);

  // Hover zoom and inspection state
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState(2.3);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Review submission state
  const [reviews, setReviews] = useState<Review[]>(() => StoreService.getReviews(product.id));
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isOutOfStock = product.stock <= 0 || product.isSold;
  const currentPrice = product.salePrice || product.price;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText) return;

    const added = StoreService.addReview({
      productId: product.id,
      customerName: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewText,
      verifiedPurchase: true
    });

    setReviews([added, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  // Hover-zoom cursor tracking handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
      setMousePos({ x, y });
      setIsHovered(true);
    }
  };

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.condition === product.condition))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-5xl w-full max-h-[94dvh] overflow-y-auto shadow-2xl border border-[#DFD1BD] z-10 p-4 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#57534E] hover:text-[#1C1917] transition-all shadow-md z-20 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Primary Main Image Stage with Smooth Hover-Zoom */}
            <div 
              className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-[#E7DFD3] shadow-inner group select-none cursor-crosshair"
              onMouseEnter={() => setIsHovered(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                setIsHovered(false);
                setMousePos({ x: 50, y: 50 });
              }}
              onTouchStart={() => setIsHovered(true)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => setIsHovered(false)}
            >
              <img 
                src={product.images[activeImageIndex] || product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200 ease-out will-change-transform select-none pointer-events-none"
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: isHovered ? `scale(${zoomLevel})` : 'scale(1)',
                }}
              />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 pointer-events-none z-10">
                {isOutOfStock ? (
                  <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[#1C1917] text-[#FAF7F2] rounded shadow">
                    {product.isOneOfAKind ? 'SOLD — One-of-a-Kind' : 'Out of Stock'}
                  </span>
                ) : product.isOneOfAKind ? (
                  <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase bg-[#88672D] text-white rounded shadow flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    <span>Certified 1-of-1 Artifact</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-semibold tracking-wider uppercase bg-[#FAF7F2]/90 backdrop-blur-xs text-[#88672D] border border-[#DFCBB0] rounded shadow-xs">
                    {product.condition}
                  </span>
                )}
              </div>

              {/* Top-Right Hover-Zoom Controls & Full Lightbox Trigger */}
              <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
                {/* Zoom Level Selector */}
                <div className="flex items-center bg-black/60 backdrop-blur-xs rounded-lg p-0.5 border border-white/20 shadow-md">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomLevel(prev => prev === 2 ? 2.5 : (prev === 2.5 ? 3.2 : 2));
                    }}
                    title={`Current zoom: ${zoomLevel}x. Click to adjust magnification.`}
                    className="px-2 py-1 text-[11px] font-mono font-bold text-amber-300 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <ZoomIn className="w-3 h-3 text-[#C5A059]" />
                    <span>{zoomLevel}x</span>
                  </button>
                </div>

                {/* Fullscreen Lightbox Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  title="Open Fullscreen Lightbox Inspection"
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white/90 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#E8DCC4]" />
                </button>
              </div>

              {/* Bottom Interactive Hover Hints */}
              {isHovered ? (
                <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none transition-all duration-200">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#1C1917]/90 backdrop-blur-xs text-[#FAF7F2] text-[11px] font-medium border border-[#C5A059]/40 shadow-lg">
                    <span className="flex items-center space-x-1.5 text-[#E5C378]">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="font-semibold">Inspection Loupe Active • {zoomLevel}x</span>
                    </span>
                    <span className="text-[10px] text-stone-300 font-light hidden sm:inline">
                      Move cursor across surface to examine resin clarity &amp; fine patina
                    </span>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none transition-opacity duration-200 group-hover:opacity-0">
                  <div className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-black/55 backdrop-blur-xs text-white text-[11px] font-light border border-white/15 shadow-sm">
                    <div className="flex items-center space-x-1.5 text-stone-200">
                      <ZoomIn className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Hover or drag cursor to inspect fine resin &amp; antique details</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-18 h-18 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-[#88672D] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Authenticity Certificate Callout */}
            {product.certificateNumber && (
              <div className="p-4 rounded-xl bg-white border border-[#DFD1BD] shadow-xs flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-6 h-6 text-[#88672D] flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[#1C1917] block">Certificate No: {product.certificateNumber}</span>
                    <span className="text-[11px] text-[#78716C]">Registered in Atelier Archival Registry</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#F3ECE0] text-[#88672D] font-mono text-[10px] rounded font-bold">
                  VERIFIED
                </span>
              </div>
            )}

          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            <div>
              <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
                <span className="uppercase tracking-widest font-medium text-[#88672D]">
                  {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
                </span>
                <span className="font-mono text-xs text-[#A8A29E]">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#1C1917] leading-snug">
                {product.name}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center text-[#C5A059]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#1C1917]">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-[#78716C]">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-xl bg-white border border-[#E7DFD3] flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                  {formatCurrency(currentPrice, currency)}
                </span>
                {product.salePrice && (
                  <span className="ml-3 text-sm text-[#A8A29E] line-through font-light">
                    {formatCurrency(product.price, currency)}
                  </span>
                )}
              </div>

              <div className="text-right text-xs">
                {isOutOfStock ? (
                  <span className="text-red-700 font-bold uppercase tracking-wider">Sold Out</span>
                ) : product.stock === 1 ? (
                  <span className="text-amber-700 font-semibold">Only 1 Piece Available</span>
                ) : (
                  <span className="text-emerald-700 font-medium">In Stock ({product.stock} available)</span>
                )}
              </div>
            </div>

            {/* Add to Cart & Buy Buttons */}
            {!isOutOfStock ? (
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#E7DFD3] bg-white rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={product.isOneOfAKind || quantity <= 1}
                      className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-sm font-semibold hover:bg-[#FAF7F2] disabled:opacity-40 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold select-none">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={product.isOneOfAKind || quantity >= product.stock}
                      className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-sm font-semibold hover:bg-[#FAF7F2] disabled:opacity-40 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => onAddToCart(product, quantity)}
                    className="flex-1 py-3 sm:py-3.5 px-4 bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] text-xs font-semibold tracking-widest uppercase rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 min-h-[46px] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                    <span>Add to Cart</span>
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-3 rounded-lg border transition-all min-h-[46px] min-w-[46px] flex items-center justify-center cursor-pointer ${
                      isWishlisted 
                        ? 'bg-[#88672D] border-[#88672D] text-white' 
                        : 'bg-white border-[#E7DFD3] text-[#57534E] hover:border-[#88672D]'
                    }`}
                    title="Wishlist"
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  {/* Share */}
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-lg border border-[#E7DFD3] bg-white text-[#57534E] hover:border-[#88672D] transition-all min-h-[46px] min-w-[46px] flex items-center justify-center cursor-pointer"
                    title="Copy Product Link"
                    aria-label="Copy product link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Instant Buy Now Button */}
                <button
                  onClick={() => {
                    if (onBuyNow) {
                      onBuyNow(product, quantity);
                    } else {
                      onAddToCart(product, quantity);
                    }
                  }}
                  className="w-full py-3.5 px-4 bg-[#C5A059] hover:bg-[#D4AF37] text-[#1C1917] text-xs sm:text-sm font-semibold tracking-widest uppercase rounded-lg shadow-md transition-all cursor-pointer min-h-[48px] flex items-center justify-center"
                >
                  Buy Now with Express Checkout
                </button>

                {/* Direct WhatsApp Consultation with Salman Khan */}
                <a
                  href={`https://wa.me/923149281875?text=Hello%20Salman%20Khan,%20I%20am%20inquiring%20about%20the%20"${encodeURIComponent(product.name)}"%20(SKU:%20${product.sku})%20priced%20at%20${encodeURIComponent(formatCurrency(currentPrice, currency))}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#FAF7F2] hover:bg-[#F3ECE0] text-[#1C1917] border border-[#DFCBB0] text-xs font-semibold tracking-wider uppercase rounded-lg flex items-center justify-center space-x-2 transition-all min-h-[46px]"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span>WhatsApp Concierge (Salman Khan)</span>
                </a>
              </div>
            ) : (
              <div className="p-4 bg-[#F3ECE0] rounded-xl border border-[#DFCBB0] text-center space-y-2">
                <p className="font-serif text-lg font-semibold text-[#1C1917]">
                  {product.isOneOfAKind ? 'This One-of-a-Kind Piece Has Been Acquired' : 'Currently Out of Stock'}
                </p>
                <p className="text-xs text-[#78716C]">
                  Interested in commissioning a similar bespoke piece? Contact our studio artisans.
                </p>
              </div>
            )}

            {/* Tabs: Story / Specs / Care / Reviews */}
            <div className="pt-4 border-t border-[#E7DFD3]">
              <div className="flex border-b border-[#E7DFD3] text-xs font-medium uppercase tracking-wider text-[#78716C] overflow-x-auto">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`py-2 px-3 border-b-2 transition-colors flex-shrink-0 ${
                    activeTab === 'story' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
                  }`}
                >
                  Story Behind the Piece
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`py-2 px-3 border-b-2 transition-colors flex-shrink-0 ${
                    activeTab === 'specs' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`py-2 px-3 border-b-2 transition-colors flex-shrink-0 ${
                    activeTab === 'care' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
                  }`}
                >
                  Care &amp; Delivery
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-3 border-b-2 transition-colors flex-shrink-0 ${
                    activeTab === 'reviews' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              <div className="py-4 text-xs text-[#57534E] leading-relaxed">
                {activeTab === 'story' && (
                  <div className="space-y-3">
                    <p className="font-light italic font-serif text-sm text-[#44403C]">
                      "{product.story}"
                    </p>
                    <p className="font-light">
                      {product.description}
                    </p>
                    {product.provenance && (
                      <div className="p-3 bg-white rounded border border-[#E7DFD3]">
                        <strong className="block text-[#1C1917] mb-1">Historical Lineage:</strong>
                        {product.provenance}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded border border-[#E7DFD3]">
                      <span className="text-[#78716C] block text-[10px] uppercase">Dimensions</span>
                      <span className="font-medium text-[#1C1917]">{product.dimensions}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#E7DFD3]">
                      <span className="text-[#78716C] block text-[10px] uppercase">Weight</span>
                      <span className="font-medium text-[#1C1917]">{product.weight}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#E7DFD3]">
                      <span className="text-[#78716C] block text-[10px] uppercase">Material</span>
                      <span className="font-medium text-[#1C1917]">{product.material}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#E7DFD3]">
                      <span className="text-[#78716C] block text-[10px] uppercase">Color Palette</span>
                      <span className="font-medium text-[#1C1917]">{product.color}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-[#88672D] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C1917] block">Estimated Delivery:</strong>
                        <span>{product.estimatedDelivery || "3 to 5 business days"}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Truck className="w-4 h-4 text-[#88672D] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C1917] block">Care &amp; Preservation:</strong>
                        <span>{product.careInstructions || "Dust with microfiber cloth. Avoid harsh solvents."}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 pt-2 border-t border-[#E7DFD3]">
                      <MapPin className="w-4 h-4 text-[#88672D] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C1917] block">In-Person Atelier Viewing:</strong>
                        <span>Private appointment viewings available at our Gulberg III, Lahore gallery. Grounded with live Google Maps routing.</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Review list */}
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {reviews.length === 0 ? (
                        <p className="text-[#78716C]">No reviews yet for this piece.</p>
                      ) : (
                        reviews.map(r => (
                          <div key={r.id} className="p-3 bg-white rounded border border-[#E7DFD3] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#1C1917]">{r.customerName}</span>
                              <span className="text-[10px] text-[#78716C]">{r.date}</span>
                            </div>
                            <div className="flex text-[#C5A059]">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-[#57534E]">{r.comment}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Review Form */}
                    <form onSubmit={handleAddReview} className="pt-3 border-t border-[#E7DFD3] space-y-2">
                      <h4 className="font-semibold text-[#1C1917]">Write a Review</h4>
                      {reviewSubmitted && (
                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded text-xs">
                          Thank you! Your verified review has been published.
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={newReviewAuthor}
                          onChange={e => setNewReviewAuthor(e.target.value)}
                          className="px-2.5 py-1.5 bg-white border border-[#E7DFD3] rounded text-xs"
                        />
                        <select
                          value={newReviewRating}
                          onChange={e => setNewReviewRating(Number(e.target.value))}
                          className="px-2.5 py-1.5 bg-white border border-[#E7DFD3] rounded text-xs"
                        >
                          <option value={5}>5 Stars - Exceptional</option>
                          <option value={4}>4 Stars - Very Good</option>
                          <option value={3}>3 Stars - Average</option>
                        </select>
                      </div>
                      <textarea
                        required
                        rows={2}
                        placeholder="Your thoughts on the craftsmanship..."
                        value={newReviewText}
                        onChange={e => setNewReviewText(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E7DFD3] rounded text-xs"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#1C1917] text-[#FAF7F2] text-xs font-semibold uppercase rounded"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Related Artifacts Carousel/Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[#E7DFD3]">
            <h3 className="text-lg font-serif font-semibold text-[#1C1917] mb-4">
              Related Heirloom Pieces
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => {
                    handleSelectRelated?.(rel);
                    setActiveImageIndex(0);
                  }}
                  className="cursor-pointer group p-3 bg-white rounded-xl border border-[#E7DFD3] hover:border-[#C5A059] transition-all flex items-center space-x-3"
                >
                  <img src={rel.images[0]} alt={rel.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-[#1C1917] truncate group-hover:text-[#88672D]">
                      {rel.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#1C1917] font-sans">
                      {formatCurrency(rel.salePrice || rel.price, currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Fullscreen High-Definition Inspection Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar Controls */}
          <div 
            className="flex items-center justify-between z-10 text-white border-b border-white/10 pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Atelier Masterpiece Loupe • {product.category}</span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#FAF7F2]">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center space-x-3">
              {/* Zoom adjustments */}
              <div className="flex items-center bg-white/10 rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(1.5, +(prev - 0.5).toFixed(1)))}
                  className="p-1.5 hover:bg-white/20 rounded text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-xs font-bold text-[#E5C378]">
                  {zoomLevel}x
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(4, +(prev + 0.5).toFixed(1)))}
                  className="p-1.5 hover:bg-white/20 rounded text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Close Lightbox */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central High-Definition Stage with Interactive Hover & Pan */}
          <div 
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden rounded-xl border border-white/10 bg-black/40 cursor-crosshair"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            <img 
              src={product.images[activeImageIndex] || product.images[0]} 
              alt={product.name}
              className="max-h-[72vh] max-w-[85vw] object-contain transition-transform duration-150 ease-out will-change-transform select-none pointer-events-none"
              style={{
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                transform: `scale(${zoomLevel})`
              }}
            />

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#C5A059] text-white hover:text-[#1C1917] transition-all border border-white/20 cursor-pointer shadow-lg"
                  title="Previous Angle"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev + 1) % product.images.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#C5A059] text-white hover:text-[#1C1917] transition-all border border-white/20 cursor-pointer shadow-lg"
                  title="Next Angle"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Hint pill */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-xs text-[#FAF7F2] text-xs font-light border border-white/20 shadow-lg flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Move cursor to pan across fine botanical resin layers &amp; gold flakes</span>
              </div>
            </div>
          </div>

          {/* Bottom Thumbnails */}
          <div 
            className="flex items-center justify-center space-x-3 pt-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-[#C5A059] scale-105 shadow-md' : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
