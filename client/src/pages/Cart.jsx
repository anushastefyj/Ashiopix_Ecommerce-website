import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../context/cartStore';
import { useAuthStore, api } from '../context/authStore';
import ProductCard from '../components/ProductCard';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Sparkles } from 'lucide-react';

export default function Cart() {
  const { cartItems, fetchCart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [recs, setRecs] = useState([]);

  useEffect(() => {
    fetchCart();
    
    // Load recommendations
    const loadRecommendations = async () => {
      try {
        const { data } = await api.get('/products');
        setRecs(data.products.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    loadRecommendations();
  }, []);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 5; // Free shipping over $50, else $5
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div class="max-w-md mx-auto text-center py-20 px-4 space-y-6 animate-fade-in">
        <div class="w-20 h-20 bg-white border border-gray-150 text-gray-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShoppingCart size={32} />
        </div>
        <h2 class="text-2xl font-black text-[#1F2937]">Your cart is empty</h2>
        <p class="text-sm text-gray-500 max-w-xs mx-auto">
          Explore our fashion collections to add summer essentials matching your style.
        </p>
        <Link
          to="/products"
          class="inline-block bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-[#5B7CFA]/10 hover:scale-105 transition-all text-xs"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-16">
      <div>
        <h1 class="text-3xl font-black text-[#1F2937] pb-6 border-b border-gray-200">Shopping Cart</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* Cart Items List */}
          <div class="lg:col-span-2 space-y-4">
            <div class="flex justify-between items-center pb-2">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{cartItems.length} items selected</span>
              <button
                onClick={clearCart}
                class="text-xs font-bold text-red-500 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>

            <div class="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-gray-200/60 rounded-3xl gap-4 shadow-sm"
                >
                  {/* Product Meta */}
                  <div class="flex items-center space-x-4">
                    <div class="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                      <p class="text-xs text-gray-400">{item.brand}</p>
                      <p class="text-sm font-bold text-[#5B7CFA] mt-1">
                        ${(item.discountPrice || item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div class="flex items-center justify-between w-full sm:w-auto gap-8 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div class="flex items-center border border-gray-200 rounded-full p-1 bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        class="p-1 rounded-full hover:bg-white text-gray-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span class="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        class="p-1 rounded-full hover:bg-white text-gray-600"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div class="flex items-center space-x-4">
                      <span class="text-sm font-black text-gray-800">
                        ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div class="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm h-fit space-y-6">
            <h3 class="text-lg font-black text-gray-900 pb-3 border-b border-gray-150">Summary</h3>

            <div class="space-y-3 text-xs">
              <div class="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span class="font-bold text-gray-850">${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>Estimated Tax (8%)</span>
                <span class="font-bold text-gray-855">${tax.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span class="font-bold text-gray-860">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p class="text-[10px] text-gray-400 italic">Add ${(50 - subtotal).toFixed(2)} more for free shipping</p>
              )}
              <div class="flex justify-between text-base font-black text-[#1F2937] pt-3 border-t border-gray-150">
                <span>Total</span>
                <span class="text-[#5B7CFA] text-lg">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              class="w-full bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold py-4 rounded-full flex items-center justify-center space-x-2 shadow-lg shadow-[#5B7CFA]/10 hover:shadow-none transition-all text-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>

            <Link
              to="/products"
              class="block text-center text-xs font-semibold text-gray-400 hover:text-black"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended complete your look products */}
      {recs.length > 0 && (
        <div class="space-y-6 pt-6 border-t border-gray-200/50">
          <div class="flex items-center space-x-2">
            <Sparkles size={16} class="text-[#5B7CFA]" />
            <h3 class="text-xl font-black text-[#1F2937]">Complete Your Look</h3>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recs.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
