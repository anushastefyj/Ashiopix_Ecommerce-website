import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../context/productStore';
import { useAuthStore } from '../context/authStore';
import { api } from '../context/authStore';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, TrendingUp, ShoppingBag } from 'lucide-react';

export default function Home() {
  const { products, loading, fetchProducts } = useProductStore();
  const { user } = useAuthStore();
  
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUserRecs = async () => {
      if (!user) return;
      setRecLoading(true);
      try {
        const { data } = await api.get(`/recommendations/user/${user._id}`);
        setRecommendations(data);
      } catch (err) {
        console.error('Failed to load personalized recommendations', err);
      } finally {
        setRecLoading(false);
      }
    };
    fetchUserRecs();
  }, [user]);

  const featuredProducts = products.slice(0, 4);

  // Categories helper
  const categories = [
    { name: 'Clothing', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600', count: 'Clothing items' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600', count: 'Hats, belts & accessories' },
    { name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', count: 'Designer heels & boots' },
    { name: 'Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', count: 'Leather backpacks & totes' },
  ];

  return (
    <div class="space-y-20 pb-20 animate-fade-in">
      {/* 2. HERO SECTION (BANNER) */}
      <div class="bg-[#F5F0E8] rounded-3xl p-8 sm:p-12 lg:p-16 border border-gray-200/40">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side Content */}
          <div class="space-y-8">
            <span class="text-xs font-bold text-[#5B7CFA] tracking-widest uppercase block">
              New Season Arrival
            </span>
            <h1 class="text-5xl sm:text-6xl font-black text-[#1F2937] leading-tight">
              Redefining the <br/>
              <span class="text-[#5B7CFA]">Future of Shopping</span>
            </h1>
            <p class="text-base sm:text-lg text-gray-650 leading-relaxed max-w-md">
              Experience curated fashion, smarter choices, and seamless shopping — all in one place.
            </p>
            
            <div class="flex items-center space-x-4">
              <Link
                to="/products"
                class="bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-[#5B7CFA]/10 hover:shadow-none hover:translate-y-[1px] transition-all text-sm"
              >
                Shop Now
              </Link>
              <Link
                to="/products?filter=explore"
                class="border-2 border-[#1F2937] hover:bg-[#1F2937] hover:text-white text-[#1F2937] font-bold px-8 py-3.5 rounded-full transition-all text-sm"
              >
                Explore Collection
              </Link>
            </div>

            {/* Small decorative product images */}
            <div class="flex items-center space-x-4 pt-4 border-t border-gray-200/50 max-w-xs">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=120"
                alt="handbag decoration"
                class="w-12 h-12 rounded-xl object-cover border border-white shadow-sm"
              />
              <img
                src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=120"
                alt="boots decoration"
                class="w-12 h-12 rounded-xl object-cover border border-white shadow-sm"
              />
              <span class="text-xs font-semibold text-gray-500">Premium apparel accessories decoration.</span>
            </div>
          </div>

          {/* Right Side fashion products */}
          <div class="relative grid grid-cols-2 gap-4">
            <div class="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"
                alt="Coats on hanger"
                class="rounded-3xl shadow-md h-60 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400"
                alt="Boots"
                class="rounded-3xl shadow-md h-40 w-full object-cover"
              />
            </div>
            <div class="pt-8">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
                alt="Luxury bag"
                class="rounded-3xl shadow-md h-[416px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SHOP BY CATEGORY SECTION */}
      <div class="space-y-8 max-w-7xl mx-auto">
        <div class="text-center">
          <h2 class="text-3xl font-black text-[#1F2937]">Shop by Category</h2>
          <p class="text-sm text-gray-500 mt-1">Carefully curated fashion ecosystems</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              class="group relative overflow-hidden rounded-3xl aspect-[3/4] shadow-sm block bg-gray-100"
            >
              {/* Category Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Black overlay */}
              <div class="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
              
              {/* Overlay Content */}
              <div class="absolute bottom-6 left-6 right-6 flex flex-col justify-end text-white">
                <h3 class="text-xl font-bold tracking-wide">{cat.name}</h3>
                <span class="text-xs text-white/70 mt-1 font-medium">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended For You row */}
      {user && recommendations.length > 0 && (
        <div class="space-y-8 max-w-7xl mx-auto bg-white/50 p-6 sm:p-8 rounded-3xl border border-gray-200/40">
          <div class="flex justify-between items-end">
            <div>
              <span class="inline-flex items-center space-x-1.5 text-xs font-bold text-[#5B7CFA] uppercase tracking-wider bg-[#5B7CFA]/10 px-3 py-1 rounded-full mb-2">
                <Sparkles size={12} />
                <span>Predictive AI Pick</span>
              </span>
              <h2 class="text-3xl font-black text-[#1F2937]">Recommended For You</h2>
            </div>
            <Link to="/products" class="text-xs font-bold text-[#5B7CFA] hover:text-[#4864e0] flex items-center space-x-1">
              <span>Explore shop</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Featured Clothing Row */}
      <div class="space-y-8 max-w-7xl mx-auto">
        <div class="flex justify-between items-end">
          <div>
            <h2 class="text-3xl font-black text-[#1F2937]">New Arrivals</h2>
            <p class="text-sm text-gray-500">Popular items trending in store this week</p>
          </div>
          <Link to="/products" class="text-xs font-bold text-[#5B7CFA] hover:text-[#4864e0] flex items-center space-x-1">
            <span>Shop All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} class="bg-white border border-gray-100 rounded-3xl p-4 space-y-4 animate-pulse h-[340px]" />
            ))}
          </div>
        ) : (
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
