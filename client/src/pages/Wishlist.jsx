import React, { useState, useEffect } from 'react';
import { useAuthStore, api } from '../context/authStore';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { user } = useAuthStore();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/wishlist');
      const localWishlist = JSON.parse(localStorage.getItem('localWishlist')) || [];
      const mergedWishlist = [...data, ...localWishlist.filter((lp) => !data.some((sp) => sp._id === lp._id))];
      setWishlist(mergedWishlist);
      localStorage.setItem('localWishlist', JSON.stringify(mergedWishlist));
    } catch (err) {
      console.error('Failed to load server wishlist, using local:', err);
      const localWishlist = JSON.parse(localStorage.getItem('localWishlist')) || [];
      setWishlist(localWishlist);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  if (!user) {
    return (
      <div class="max-w-md mx-auto text-center py-20 px-4 space-y-6">
        <div class="w-20 h-20 bg-white border border-gray-150 text-gray-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Heart size={32} />
        </div>
        <h2 class="text-2xl font-black text-[#1F2937]">Please log in</h2>
        <p class="text-sm text-gray-500">Sign in to save items to your personal wishlist catalog.</p>
        <Link to="/login" class="inline-block bg-[#5B7CFA] text-white font-bold px-8 py-3.5 rounded-full text-xs">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <h1 class="text-3xl font-black text-[#1F2937] pb-6 border-b border-gray-200 flex items-center space-x-2">
        <Heart size={28} class="text-[#5B7CFA] fill-current" />
        <span>My Wishlist</span>
      </h1>

      {loading ? (
        <div class="flex justify-center py-20">
          <div class="w-8 h-8 border-4 border-[#5B7CFA] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wishlist.length === 0 ? (
        <div class="text-center py-20 max-w-sm mx-auto space-y-4 bg-white p-8 rounded-3xl border border-gray-150">
          <p class="text-sm text-gray-400 italic">Your wishlist is currently empty. Click heart icons on items to save them here.</p>
          <Link to="/products" class="inline-block bg-[#5B7CFA]/10 text-[#5B7CFA] font-bold px-6 py-2.5 rounded-full text-xs">
            Browse Shop
          </Link>
        </div>
      ) : (
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
