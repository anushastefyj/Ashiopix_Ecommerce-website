import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div class="max-w-4xl mx-auto px-4 py-12 space-y-12 animate-fade-in text-center">
      {/* Header section */}
      <div class="space-y-4">
        <span class="inline-flex items-center space-x-1.5 bg-[#5B7CFA]/10 text-[#5B7CFA] text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full">
          <Sparkles size={12} />
          <span>Our Brand Identity</span>
        </span>
        <h1 class="text-4xl sm:text-5xl font-black text-[#1F2937]">About ASHIOPIX</h1>
        <p class="text-lg text-gray-500 max-w-xl mx-auto italic font-medium">
          "Pixels of Perfect Shopping"
        </p>
      </div>

      {/* Main description container */}
      <div class="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/60 shadow-sm text-left space-y-6 leading-relaxed text-sm text-gray-500">
        <p>
          Welcome to <strong class="text-gray-800">ASHIOPIX</strong>, a modern destination redefining the future of digital retail. We combine predictive AI recommendations with handpicked fashion collections to deliver styling choices customized just for you.
        </p>
        <p>
          Our mission is to establish a seamless, delightful, and highly personalized shopping journey where smart discovery meets premium quality. Every item in our catalog is curated with strict attention to material textures, construction durability, and modern shapes.
        </p>
      </div>

      {/* Brand pillars */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div class="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-3">
          <div class="p-3 bg-[#5B7CFA]/10 text-[#5B7CFA] rounded-2xl w-fit">
            <Sparkles size={20} />
          </div>
          <h3 class="font-bold text-gray-800 text-sm">Smart Suggestions</h3>
          <p class="text-xs text-gray-500">Intelligent predictive recommendation matrices showing you what you actually love.</p>
        </div>

        <div class="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-3">
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
            <ShieldCheck size={20} />
          </div>
          <h3 class="font-bold text-gray-800 text-sm">Cash on Delivery (COD)</h3>
          <p class="text-xs text-gray-500">Shop first, pay when your product arrives right at your doorstep.</p>
        </div>

        <div class="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm space-y-3">
          <div class="p-3 bg-red-50 text-red-500 rounded-2xl w-fit">
            <Heart size={20} />
          </div>
          <h3 class="font-bold text-gray-800 text-sm">Curated Collection</h3>
          <p class="text-xs text-gray-500">Natural linen, tailored coats, and leather goods verified for luxury comfort and durability.</p>
        </div>
      </div>

      {/* Call to action */}
      <div class="pt-6">
        <Link
          to="/products"
          class="inline-flex items-center space-x-2 bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-[#5B7CFA]/15 hover:scale-105 transition-all text-xs"
        >
          <span>Start Shopping Now</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
