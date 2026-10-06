import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Grid3X3, 
  LayoutList, 
  Search, 
  X, 
  ChevronDown, 
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SupportedCurrency, formatCurrency } from '../utils/currency';

interface ShopViewProps {
  products: Product[];
  currency: SupportedCurrency;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  initialCategory?: string;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  currency,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onBuyNow,
  initialCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(80000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const conditions = ['All', 'Handmade', 'Original Antique', 'Antique-Inspired', 'Vintage', 'One of a Kind'];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category match
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Condition match
      if (selectedCondition !== 'All' && product.condition !== selectedCondition) {
        if (selectedCondition === 'One of a Kind' && !product.isOneOfAKind) return false;
        if (selectedCondition !== 'One of a Kind' && product.condition !== selectedCondition) return false;
      }
      // Stock match
      if (inStockOnly && (product.stock <= 0 || product.isSold)) {
        return false;
      }
      // Price match
      const price = product.salePrice || product.price;
      if (price > maxPrice) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesMaterial = product.material.toLowerCase().includes(query);
        const matchesTags = product.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesSku && !matchesMaterial && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedCategory, selectedCondition, inStockOnly, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCondition('All');
    setInStockOnly(false);
    setMaxPrice(80000);
    setSearchQuery('');
  };

  return (
    <div className="py-8 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-[#E7DFD3] pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#88672D] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>The Atelier Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1C1917]">
              Artisan Décor &amp; Antique Gallery
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1 font-light">
              Browsing {filteredProducts.length} handcrafted decorative items and certified heirlooms
            </p>
          </div>

          {/* View toggle & Mobile Filter button */}
          <div className="flex items-center justify-between sm:justify-end space-x-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-3.5 py-2 bg-white border border-[#E7DFD3] rounded text-xs font-medium text-[#1C1917]"
            >
              <Filter className="w-4 h-4 text-[#88672D]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-1 bg-white border border-[#E7DFD3] rounded p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#F3ECE0] text-[#1C1917]' : 'text-[#78716C] hover:text-[#1C1917]'}`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-[#F3ECE0] text-[#1C1917]' : 'text-[#78716C] hover:text-[#1C1917]'}`}
                title="List View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main 2-column layout: Sidebar Filters & Product Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-xl border border-[#E7DFD3] shadow-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F3ECE0]">
              <div className="flex items-center space-x-2 text-sm font-semibold uppercase tracking-wider text-[#1C1917]">
                <SlidersHorizontal className="w-4 h-4 text-[#88672D]" />
                <span>Refine Gallery</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-[#88672D] hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search in Catalog */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
                Search In Catalog
              </label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Flower, plate, brass, SKU..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E7DFD3] rounded focus:outline-none focus:border-[#C5A059]"
                />
                <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-2.5" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
                Category
              </label>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors flex items-center justify-between ${
                      selectedCategory === cat 
                        ? 'bg-[#F3ECE0] text-[#88672D] font-bold' 
                        : 'text-[#57534E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat === 'All' ? (
                      <span className="text-[10px] text-gray-400">{products.length}</span>
                    ) : (
                      <span className="text-[10px] text-gray-400">
                        {products.filter(p => p.category === cat).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition / Provenance */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
                Condition &amp; Heritage
              </label>
              <div className="space-y-1">
                {conditions.map(cond => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors flex items-center justify-between ${
                      selectedCondition === cond 
                        ? 'bg-[#F3ECE0] text-[#88672D] font-bold' 
                        : 'text-[#57534E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{cond}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
                <span>Max Price</span>
                <span className="text-[#88672D] font-bold font-sans">
                  {formatCurrency(maxPrice, currency)}
                </span>
              </div>
              <input 
                type="range"
                min={10000}
                max={80000}
                step={2500}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#88672D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A8A29E] mt-1">
                <span>{formatCurrency(10000, currency)}</span>
                <span>{formatCurrency(80000, currency)}</span>
              </div>
            </div>

            {/* In stock toggle */}
            <div className="pt-2 border-t border-[#F3ECE0]">
              <label className="flex items-center space-x-2 text-xs text-[#1C1917] cursor-pointer">
                <input 
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="rounded text-[#88672D] focus:ring-0"
                />
                <span>In Stock &amp; Available Only</span>
              </label>
            </div>

          </div>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Sort & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-[#E7DFD3] text-xs">
              <div className="text-[#57534E]">
                Showing <strong className="font-semibold text-[#1C1917]">{filteredProducts.length}</strong> pieces
                {selectedCategory !== 'All' && <span> in <em className="font-serif text-[#88672D]">{selectedCategory}</em></span>}
              </div>

              {/* Sort selector */}
              <div className="flex items-center space-x-2">
                <span className="text-[#78716C] uppercase tracking-wider text-[11px] flex items-center space-x-1">
                  <ArrowUpDown className="w-3 h-3 text-[#88672D]" />
                  <span>Sort By:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-[#FAF7F2] border border-[#E7DFD3] rounded px-2.5 py-1.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Products Listing */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-[#E7DFD3] p-8 space-y-3">
                <p className="font-serif text-2xl text-[#1C1917]">No pieces match your filter criteria.</p>
                <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                  Try adjusting your price range, selected category, or clear search queries to discover more artifacts.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-5 py-2 bg-[#1C1917] text-[#FAF7F2] text-xs font-semibold tracking-wider uppercase rounded"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                  />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredProducts.map(product => {
                  const currentPrice = product.salePrice || product.price;
                  const isOutOfStock = product.stock <= 0 || product.isSold;
                  return (
                    <div 
                      key={product.id}
                      className="bg-white rounded-xl border border-[#E7DFD3] p-4 flex flex-col sm:flex-row gap-5 items-center hover:border-[#C5A059] transition-all shadow-xs"
                    >
                      <div className="w-full sm:w-44 h-44 rounded-lg overflow-hidden bg-[#F3ECE0] flex-shrink-0 cursor-pointer" onClick={() => onQuickView(product)}>
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>

                      <div className="flex-1 space-y-2 text-left w-full">
                        <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                          <span className="uppercase tracking-wider font-medium text-[#88672D]">{product.category}</span>
                          <span className="font-mono">{product.sku}</span>
                        </div>
                        <h3 
                          className="font-serif text-lg sm:text-xl font-semibold text-[#1C1917] hover:text-[#88672D] cursor-pointer transition-colors"
                          onClick={() => onQuickView(product)}
                        >
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#57534E] line-clamp-2 font-light">
                          {product.story || product.description}
                        </p>
                        <div className="text-[11px] text-[#78716C]">
                          <span className="font-medium">Material:</span> {product.material}
                        </div>
                      </div>

                      <div className="sm:text-right flex flex-col justify-between sm:items-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F3ECE0] gap-3">
                        <div>
                          <div className="font-serif text-xl font-bold text-[#1C1917]">
                            {formatCurrency(currentPrice, currency)}
                          </div>
                          {product.salePrice && (
                            <div className="text-xs text-gray-400 line-through">
                              {formatCurrency(product.price, currency)}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onQuickView(product)}
                            className="px-3 py-2 text-xs border border-[#E7DFD3] rounded text-[#1C1917] hover:bg-[#F3ECE0]"
                          >
                            Details
                          </button>
                          <button
                            disabled={isOutOfStock}
                            onClick={() => onAddToCart(product)}
                            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1917] text-[#FAF7F2] hover:bg-[#2C2723] rounded disabled:bg-gray-300"
                          >
                            {isOutOfStock ? 'Sold' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
