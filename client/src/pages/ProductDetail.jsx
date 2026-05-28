import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../context/productStore';
import { useCartStore } from '../context/cartStore';
import { useAuthStore } from '../context/authStore';
import { api } from '../context/authStore';
import ProductCard from '../components/ProductCard';
import { Star, ShoppingCart, Heart, Plus, Minus, Send, Sparkles } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, fetchProductById, addProductReview } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  // Fashion Detail additions
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('beige');
  const [activeTab, setActiveTab] = useState('description');

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'white', hex: '#FFFFFF', border: 'border-gray-300' },
    { name: 'black', hex: '#1F2937', border: 'border-transparent' },
    { name: 'beige', hex: '#E6DCC8', border: 'border-transparent' },
    { name: 'blue', hex: '#5B7CFA', border: 'border-transparent' },
  ];

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProductById(id);
      if (data) {
        setSelectedImage(data.image);
        // Load similar products recommendation
        setSimilarLoading(true);
        try {
          const res = await api.get(`/recommendations/products/${data._id}`);
          setSimilarProducts(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setSimilarLoading(false);
        }
      }
    };
    loadData();
    setQty(1);
  }, [id]);

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div class="w-10 h-10 border-4 border-[#5B7CFA] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-20 text-center bg-white rounded-3xl">
        <h2 class="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link to="/products" class="mt-4 inline-block bg-[#5B7CFA] text-white px-6 py-2.5 rounded-full font-semibold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSuccess('');
    setReviewError('');

    if (!comment.trim()) {
      setReviewError('Please enter a comment');
      return;
    }

    const res = await addProductReview(product._id, rating, comment);
    if (res.success) {
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);
    } else {
      setReviewError(res.error);
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      
      {/* Breadcrumbs */}
      <nav class="text-xs font-semibold text-gray-400">
        <Link to="/" class="hover:text-black">Home</Link>
        <span class="mx-2">&gt;</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} class="hover:text-black">{product.category}</Link>
        <span class="mx-2">&gt;</span>
        <span class="text-gray-600 truncate max-w-[200px] inline-block align-bottom">{product.name}</span>
      </nav>

      {/* Product Main Section */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm">
        {/* Left Column: Gallery */}
        <div class="space-y-4">
          <div class="relative overflow-hidden bg-gray-50 rounded-2xl aspect-square border border-gray-100 group">
            <img
              src={selectedImage}
              alt={product.name}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discountPercent > 0 && (
              <span class="absolute left-4 top-4 bg-green-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>
          
          {/* Thumbnails */}
          <div class="flex items-center space-x-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedImage(product.image)}
              class={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 ${
                selectedImage === product.image ? 'border-[#5B7CFA]' : 'border-gray-200'
              }`}
            >
              <img src={product.image} alt="" class="w-full h-full object-cover" />
            </button>
            {product.images && product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                class={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 ${
                  selectedImage === img ? 'border-[#5B7CFA]' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" class="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Info */}
        <div class="flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div>
              <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">{product.brand}</span>
              <h1 class="text-3xl font-extrabold text-[#1F2937] mt-1">{product.name}</h1>
            </div>

            {/* Ratings & Stock */}
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-1">
                <div class="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.round(product.rating || 0) ? 'currentColor' : 'none'}
                      class="stroke-current"
                    />
                  ))}
                </div>
                <span class="text-sm font-bold text-gray-700">{product.rating?.toFixed(1) || '0.0'}</span>
                <span class="text-xs text-gray-400">({product.numReviews || 0} reviews)</span>
              </div>
              <span class="text-gray-300">|</span>
              <span class={`text-xs font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing */}
            <div class="flex items-baseline space-x-3">
              {product.discountPrice ? (
                <>
                  <span class="text-3xl font-black text-[#5B7CFA]">${product.discountPrice.toFixed(2)}</span>
                  <span class="text-base text-gray-400 line-through">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span class="text-3xl font-black text-[#1F2937]">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p class="text-sm text-gray-500 leading-relaxed">{product.description}</p>
            
            {/* Color Selector */}
            <div class="space-y-2 pt-2">
              <span class="text-xs font-bold text-gray-400 uppercase">Selected Color: <strong class="text-gray-700 capitalize">{selectedColor}</strong></span>
              <div class="flex items-center space-x-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    class={`w-7 h-7 rounded-full border ${c.border} relative hover:scale-105 transition-transform ${
                      selectedColor === c.name ? 'ring-2 ring-offset-2 ring-[#5B7CFA]' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div class="space-y-2 pt-2">
              <span class="text-xs font-bold text-gray-400 uppercase">Selected Size: <strong class="text-gray-700">{selectedSize}</strong></span>
              <div class="flex items-center space-x-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    class={`w-10 h-10 rounded-xl border text-xs font-bold transition-all ${
                      selectedSize === s
                        ? 'bg-[#5B7CFA] border-[#5B7CFA] text-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div class="space-y-6 pt-4 border-t border-gray-150">
            {product.stock > 0 && (
              <div class="flex items-center space-x-4">
                <span class="text-xs font-bold text-gray-400 uppercase">Quantity:</span>
                <div class="flex items-center border border-gray-200 rounded-full p-1 bg-gray-50">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    class="p-2 rounded-full hover:bg-white text-gray-600 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span class="px-4 text-sm font-bold text-gray-800">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    class="p-2 rounded-full hover:bg-white text-gray-600 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            )}

            <div class="flex space-x-3">
              <button
                onClick={() => addToCart(product, qty)}
                disabled={product.stock === 0}
                class="flex-grow bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold py-4 rounded-full shadow-lg shadow-[#5B7CFA]/10 flex items-center justify-center space-x-2 disabled:bg-gray-150 disabled:text-gray-400"
              >
                <ShoppingCart size={18} />
                <span>Add to Shopping Cart</span>
              </button>
              
              <button class="p-4 border border-gray-200 rounded-full hover:border-[#1F2937] text-gray-500 hover:text-black">
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs description, specifications, Shipping & Returns, Reviews */}
      <div class="bg-white border border-gray-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div class="flex border-b border-gray-150 pb-3 space-x-6 text-xs uppercase font-bold tracking-wider">
          <button
            onClick={() => setActiveTab('description')}
            class={`${activeTab === 'description' ? 'text-[#5B7CFA] border-b-2 border-[#5B7CFA] pb-3' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            class={`${activeTab === 'specifications' ? 'text-[#5B7CFA] border-b-2 border-[#5B7CFA] pb-3' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            class={`${activeTab === 'shipping' ? 'text-[#5B7CFA] border-b-2 border-[#5B7CFA] pb-3' : 'text-gray-400 hover:text-gray-800'}`}
          >
            Shipping & Returns
          </button>
        </div>

        <div>
          {activeTab === 'description' && (
            <p class="text-sm text-gray-500 leading-relaxed max-w-3xl">
              This seasonal fashion apparel collection delivers absolute comfort and timeless minimalist shapes. Made from premium certified natural fibers, the garment undergoes dynamic dye treatments resulting in a unique color gradient tailored for daily lifestyle pairings.
            </p>
          )}

          {activeTab === 'specifications' && (
            <div class="max-w-md border border-gray-100 rounded-2xl overflow-hidden text-xs">
              <table class="w-full text-left">
                <tbody>
                  {product.specifications && Object.entries(product.specifications).map(([key, val], i) => (
                    <tr key={i} class="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td class="px-4 py-3 font-semibold text-gray-400 bg-gray-50/50 w-1/3">{key}</td>
                      <td class="px-4 py-3 font-bold text-gray-700">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shipping' && (
            <p class="text-sm text-gray-500 leading-relaxed max-w-xl">
              Enjoy complimentary Standard Shipping on all checkout purchases over $50. Return requests are accepted within 30 days of shipment receipt. Return shipping tags are generated automatically inside Account Settings.
            </p>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      {similarProducts.length > 0 && (
        <div class="space-y-6 p-6 bg-[#F5F0E8] rounded-3xl border border-gray-200/50">
          <div class="flex items-center space-x-2">
            <Sparkles size={16} class="text-[#5B7CFA]" />
            <h3 class="text-xl font-black text-[#1F2937]">You Might Also Like</h3>
          </div>
          {similarLoading ? (
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} class="bg-white border border-gray-100 rounded-3xl h-60 animate-pulse" />
              ))}
            </div>
          ) : (
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
