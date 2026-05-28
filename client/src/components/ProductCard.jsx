import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../context/cartStore';
import { useAuthStore } from '../context/authStore';
import { api } from '../context/authStore';
import { Star, ShoppingCart, Heart, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const localWishlist = JSON.parse(localStorage.getItem('localWishlist')) || [];
    const isLocal = localWishlist.some((p) => p._id === product._id);
    return isLocal || user?.wishlist?.includes(product._id) || false;
  });

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to add items to your wishlist');
      return;
    }

    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    // Save to localStorage for robust offline / sandbox support
    const localWishlist = JSON.parse(localStorage.getItem('localWishlist')) || [];
    if (previousState) {
      const updatedWishlist = localWishlist.filter((p) => p._id !== product._id);
      localStorage.setItem('localWishlist', JSON.stringify(updatedWishlist));
    } else {
      if (!localWishlist.some((p) => p._id === product._id)) {
        localWishlist.push(product);
        localStorage.setItem('localWishlist', JSON.stringify(localWishlist));
      }
    }

    try {
      if (previousState) {
        await api.delete(`/wishlist/${product._id}`);
      } else {
        await api.post('/wishlist/add', { productId: product._id });
      }
    } catch (err) {
      console.warn('Backend wishlist sync failed, running locally in sandbox mode:', err);
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div class="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Wishlist Button */}
      {user && (
        <button
          onClick={handleWishlist}
          class={`absolute right-3 top-3 z-10 p-2 rounded-full backdrop-blur-md shadow-sm border border-gray-100 hover:scale-110 transition-all ${
            isWishlisted
              ? 'bg-red-50 text-red-500 border-red-100'
              : 'bg-white/80 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      )}

      {/* Product Image */}
      <Link to={`/products/${product._id}`} class="block relative overflow-hidden bg-gray-50 pt-[100%]">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
          alt={product.name}
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discountPercent > 0 && (
          <span class="absolute left-3 top-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Save {discountPercent}%
          </span>
        )}
        {product.stock === 0 && (
          <span class="absolute inset-0 bg-white/80 flex items-center justify-center text-sm font-semibold text-gray-700">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Info */}
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span class="text-xs text-gray-400 font-semibold tracking-wider uppercase block mb-1">
            {product.brand}
          </span>
          <Link to={`/products/${product._id}`} class="block group-hover:text-blue-600 transition-colors">
            <h3 class="text-sm font-bold text-gray-800 line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div class="flex items-center space-x-1 mt-2">
            <div class="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(product.rating || 0) ? 'currentColor' : 'none'}
                  class="stroke-current"
                />
              ))}
            </div>
            <span class="text-xs text-gray-500 font-medium">({product.numReviews || 0})</span>
          </div>
        </div>

        {/* Pricing & Add Button */}
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div>
            {product.discountPrice ? (
              <div class="flex flex-col">
                <span class="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                <span class="text-base font-extrabold text-blue-600">${product.discountPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span class="text-base font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            class={`p-2.5 rounded-full transition-all duration-200 ${
              isAdded
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white disabled:bg-gray-100 disabled:text-gray-400'
            }`}
          >
            {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
