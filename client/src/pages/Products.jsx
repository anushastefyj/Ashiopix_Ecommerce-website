import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../context/productStore';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, Grid, List } from 'lucide-react';

export default function Products() {
  const {
    products,
    categories,
    loading,
    page,
    pages,
    filters,
    setFilters,
    fetchProducts,
    fetchCategories,
    resetFilters,
  } = useProductStore();

  const [searchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Custom fashion filters
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'white', hex: '#FFFFFF', border: 'border-gray-300' },
    { name: 'black', hex: '#1F2937', border: 'border-transparent' },
    { name: 'beige', hex: '#E6DCC8', border: 'border-transparent' },
    { name: 'blue', hex: '#5B7CFA', border: 'border-transparent' },
    { name: 'brown', hex: '#8B5A2B', border: 'border-transparent' },
    { name: 'green', hex: '#2E8B57', border: 'border-transparent' },
  ];

  useEffect(() => {
    fetchCategories();
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    setFilters({
      search,
      category,
      page: 1,
    });
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleCategoryChange = (catName) => {
    setFilters({
      category: filters.category === catName ? '' : catName,
      page: 1,
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      [name]: value,
      page: 1,
    });
  };

  const handleSortChange = (e) => {
    setFilters({
      sort: e.target.value,
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setFilters({ page: newPage });
    }
  };

  const handleClearAll = () => {
    resetFilters();
    setSelectedSize('');
    setSelectedColor('');
    setInStockOnly(false);
  };

  // Local filter simulations for clothing details
  const filteredProducts = products.filter((prod) => {
    if (inStockOnly && prod.stock === 0) return false;
    // (Size & color filter values can be simulated since they are mocks in seeded data)
    return true;
  });

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Page Header */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 class="text-3xl font-black text-[#1F2937]">Summer Shop</h1>
          <p class="text-sm text-gray-500 mt-1">Explore our latest arrivals designed for comfort and style.</p>
        </div>

        {/* Sort & Mobile filter trigger */}
        <div class="flex items-center space-x-3 self-end sm:self-auto">
          {/* View Toggle */}
          <div class="hidden sm:flex items-center bg-white border border-gray-200 rounded-full p-1.5 space-x-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              class={`p-1.5 rounded-full ${viewMode === 'grid' ? 'bg-[#5B7CFA] text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              class={`p-1.5 rounded-full ${viewMode === 'list' ? 'bg-[#5B7CFA] text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <List size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            class="md:hidden flex items-center space-x-1 border border-gray-200 rounded-full px-4 py-2 text-xs font-bold text-gray-700 bg-white"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <div class="relative flex items-center border border-gray-200 rounded-full px-3 py-2 bg-white shadow-sm">
            <ArrowUpDown size={14} class="text-gray-400 mr-2" />
            <select
              value={filters.sort}
              onChange={handleSortChange}
              class="text-xs font-bold text-gray-700 bg-transparent focus:outline-none cursor-pointer pr-4"
            >
              <option value="">Sort: Featured</option>
              <option value="price">Price: Low-High</option>
              <option value="-price">Price: High-Low</option>
              <option value="-rating">Popularity</option>
              <option value="-createdAt">Newest</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
        {/* Filter Sidebar - Desktop */}
        <div class="hidden md:block space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-[#1F2937] uppercase tracking-widest text-xs">Filter Settings</h3>
            <button
              onClick={handleClearAll}
              class="text-xs font-bold text-[#5B7CFA] hover:text-[#4864e0] flex items-center space-x-1"
            >
              <RefreshCw size={10} />
              <span>Clear All</span>
            </button>
          </div>

          {/* Categories checkboxes */}
          <div class="p-5 bg-white border border-gray-200/60 rounded-3xl space-y-3 shadow-sm">
            <h4 class="font-bold text-sm text-[#1F2937]">Category</h4>
            <div class="space-y-2">
              {categories.map((cat, i) => (
                <label key={i} class="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold text-gray-600 hover:text-black">
                  <input
                    type="checkbox"
                    checked={filters.category === cat}
                    onChange={() => handleCategoryChange(cat)}
                    class="rounded text-[#5B7CFA] focus:ring-[#5B7CFA]"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div class="p-5 bg-white border border-gray-200/60 rounded-3xl space-y-4 shadow-sm">
            <h4 class="font-bold text-sm text-[#1F2937]">Price Range</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] text-gray-400 font-bold uppercase">Min ($)</label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handlePriceChange}
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7CFA]"
                />
              </div>
              <div>
                <label class="text-[10px] text-gray-400 font-bold uppercase">Max ($)</label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handlePriceChange}
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7CFA]"
                />
              </div>
            </div>
          </div>

          {/* Size Filter */}
          <div class="p-5 bg-white border border-gray-200/60 rounded-3xl space-y-3 shadow-sm">
            <h4 class="font-bold text-sm text-[#1F2937]">Size</h4>
            <div class="grid grid-cols-3 gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                  class={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    selectedSize === s
                      ? 'bg-[#5B7CFA] border-[#5B7CFA] text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div class="p-5 bg-white border border-gray-200/60 rounded-3xl space-y-3 shadow-sm">
            <h4 class="font-bold text-sm text-[#1F2937]">Color</h4>
            <div class="flex items-center space-x-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                  style={{ backgroundColor: c.hex }}
                  class={`w-6 h-6 rounded-full border ${c.border} relative hover:scale-110 transition-transform ${
                    selectedColor === c.name ? 'ring-2 ring-offset-2 ring-[#5B7CFA]' : ''
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Stock Toggle */}
          <label class="flex items-center space-x-2.5 p-4 bg-white border border-gray-200/60 rounded-3xl shadow-sm cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={() => setInStockOnly(!inStockOnly)}
              class="rounded text-[#5B7CFA] focus:ring-[#5B7CFA]"
            />
            <span class="text-xs font-bold text-gray-700">In Stock Only</span>
          </label>
        </div>

        {/* Mobile Filters Drawer */}
        {showMobileFilters && (
          <div class="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm flex justify-end">
            <div class="w-80 bg-[#F5F0E8] h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-4 border-b border-gray-200">
                  <h3 class="font-bold text-[#1F2937] text-lg">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} class="text-gray-500 hover:text-black">
                    Close
                  </button>
                </div>

                {/* Mobile filters list */}
                <div class="space-y-6 pt-4">
                  {/* Category */}
                  <div class="space-y-2">
                    <h4 class="font-bold text-xs uppercase text-gray-400">Category</h4>
                    {categories.map((cat, i) => (
                      <label key={i} class="flex items-center space-x-2 cursor-pointer text-sm font-semibold">
                        <input
                          type="checkbox"
                          checked={filters.category === cat}
                          onChange={() => handleCategoryChange(cat)}
                          class="rounded text-[#5B7CFA] focus:ring-[#5B7CFA]"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>

                  {/* Size */}
                  <div class="space-y-2">
                    <h4 class="font-bold text-xs uppercase text-gray-400">Size</h4>
                    <div class="flex flex-wrap gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          class={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
                            selectedSize === s ? 'bg-[#5B7CFA] text-white' : 'bg-white border-gray-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleClearAll}
                  class="w-full border border-gray-300 rounded-full py-3 text-xs font-bold text-gray-700 bg-white"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  class="w-full bg-[#5B7CFA] text-white rounded-full py-3 text-xs font-bold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div class="md:col-span-3 space-y-8">
          <div class="flex items-center justify-between text-xs text-gray-400 font-bold">
            <span>Showing {filteredProducts.length} results</span>
            {filters.category && (
              <span class="bg-[#5B7CFA]/10 text-[#5B7CFA] px-2.5 py-1 rounded-full">{filters.category}</span>
            )}
          </div>

          {loading ? (
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} class="bg-white border border-gray-200/50 rounded-3xl p-4 animate-pulse h-[340px]" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div class="flex flex-col items-center justify-center py-20 border border-gray-200 rounded-3xl bg-white text-center">
              <span class="text-4xl">🔍</span>
              <h3 class="font-bold text-gray-800 text-lg mt-4">No matching fashion products</h3>
              <p class="text-sm text-gray-500 mt-1 max-w-xs">We couldn't find items matching your size, color, or category configuration.</p>
              <button
                onClick={handleClearAll}
                class="mt-5 bg-[#5B7CFA]/10 text-[#5B7CFA] font-bold px-5 py-2.5 rounded-full"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div class={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div class="flex items-center justify-between border-t border-gray-200 pt-6">
              <span class="text-xs font-semibold text-gray-500">
                Page {page} of {pages}
              </span>
              <div class="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  class="p-2 border border-gray-200 rounded-full hover:bg-white disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                  class="p-2 border border-gray-200 rounded-full hover:bg-white disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
