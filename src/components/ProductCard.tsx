import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { SupportedCurrency, formatCurrency } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: SupportedCurrency;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onBuyNow
}) => {
  const isOutOfStock = product.stock <= 0 || product.isSold;
  const currentPrice = product.salePrice || product.price;
  const discountPercent = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      onAddToCart(product);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col bg-white rounded-xl border border-[#E7DFD3] hover:border-[#C5A059]/70 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F3ECE0]">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
          loading="lazy"
        />

        {/* Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#1C1917] text-[#FAF7F2] rounded shadow-xs">
              {product.isOneOfAKind ? 'SOLD • 1-of-1' : 'Out of Stock'}
            </span>
          ) : (
            <>
              {product.isOneOfAKind && (
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-[#88672D] text-white rounded shadow-xs flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                  <span>One of a Kind</span>
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#A0522D] text-white rounded">
                  -{discountPercent}%
                </span>
              )}
              {product.stock === 1 && !product.isOneOfAKind && (
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-amber-600 text-white rounded">
                  Only 1 Left
                </span>
              )}
              {product.isAntique && !product.isOneOfAKind && (
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#3E3833] text-[#FAF7F2] rounded">
                  Antique
                </span>
              )}
            </>
          )}
        </div>

        {/* Quick Action Floaters */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <motion.button
            whileTap={{ scale: 0.82 }}
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-full transition-all shadow-md ${
              isWishlisted 
                ? 'bg-[#9B783E] text-white' 
                : 'bg-white/90 text-[#44403C] hover:bg-white hover:text-[#C5A059]'
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            id={`quickview-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 rounded-full bg-white/90 text-[#44403C] hover:bg-white hover:text-[#1C1917] transition-all shadow-md"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Bottom hover action bar on image */}
        {!isOutOfStock && (
          <div className="absolute inset-x-2 bottom-2 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 py-2 px-3 bg-[#1C1917]/90 hover:bg-[#1C1917] text-[#FAF7F2] text-xs font-medium tracking-wider uppercase rounded shadow-md backdrop-blur-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNowClick}
              className="py-2 px-3 bg-[#C5A059] hover:bg-[#D4AF37] text-[#1C1917] text-xs font-semibold tracking-wider uppercase rounded shadow-md transition-colors"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>

      {/* Product Details Info */}
      <div className="p-4 flex-1 flex flex-col justify-between cursor-pointer" onClick={() => onQuickView(product)}>
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#78716C] mb-1">
            <span className="uppercase tracking-wider">{product.category}</span>
            <span className="font-mono text-[10px] text-[#A8A29E]">{product.sku}</span>
          </div>

          <h3 className="font-serif font-semibold text-base sm:text-lg text-[#1C1917] group-hover:text-[#88672D] transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#78716C] line-clamp-1 mb-2 font-light">
            {product.material}
          </p>
        </div>

        <div>
          {/* Star Rating */}
          <div className="flex items-center space-x-1 mb-2.5">
            <div className="flex items-center text-[#C5A059]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-medium text-[#1C1917]">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-[#A8A29E]">({product.reviewCount})</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline justify-between pt-2 border-t border-[#F3ECE0]">
            <div className="flex items-baseline space-x-2">
              <span className="text-base sm:text-lg font-serif font-bold text-[#1C1917]">
                {formatCurrency(currentPrice, currency)}
              </span>
              {product.salePrice && (
                <span className="text-xs text-[#A8A29E] line-through font-light">
                  {formatCurrency(product.price, currency)}
                </span>
              )}
            </div>

            <span className="text-[11px] font-medium text-[#88672D]">
              {product.condition}
            </span>
          </div>

          {/* Mobile direct button */}
          <div className="mt-3 sm:hidden">
            <button
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className={`w-full py-2 text-xs font-semibold tracking-wider uppercase rounded flex items-center justify-center space-x-1.5 ${
                isOutOfStock 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#1C1917] text-[#FAF7F2] active:bg-[#2C2723]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>

      </div>

    </motion.div>
  );
};
