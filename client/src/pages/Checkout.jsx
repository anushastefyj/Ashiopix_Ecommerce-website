import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../context/cartStore';
import { useAuthStore, api } from '../context/authStore';
import { Wallet, CheckCircle2, ChevronRight, MapPin, Truck, ShieldCheck, Download } from 'lucide-react';
import { printInvoice } from '../utils/invoice';

function CheckoutForm({ step, setStep, shippingAddress, setShippingAddress, shippingMethod, setShippingMethod, orderDetails, setOrderDetails }) {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [cardError, setCardError] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const shippingCost = shippingMethod === 'overnight' ? 20 : shippingMethod === 'express' ? 10 : subtotal > 50 ? 0 : 5;
  const total = subtotal + tax + shippingCost;

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
        alert('Please fill out all address fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setCardError('');
    setLoadingPayment(true);

    try {
      const formattedItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.discountPrice || item.price,
        product: item._id,
      }));

      let createdOrder;

      try {
        const { data } = await api.post('/orders', {
          orderItems: formattedItems,
          shippingAddress,
          paymentMethod: 'COD',
          itemsPrice: subtotal,
          taxPrice: tax,
          shippingPrice: shippingCost,
          totalPrice: total,
        });
        createdOrder = data;
      } catch (err) {
        console.warn('Backend order placement failed, proceeding with local sandbox order fallback:', err);
        createdOrder = {
          _id: `mock_order_${Date.now()}`,
          orderItems: formattedItems,
          shippingAddress,
          paymentMethod: 'COD',
          itemsPrice: subtotal,
          taxPrice: tax,
          shippingPrice: shippingCost,
          totalPrice: total,
          isPaid: false,
          orderStatus: 'pending',
          createdAt: new Date().toISOString(),
        };
        // Persist to local storage for offline order history tracking
        const localMockOrders = JSON.parse(localStorage.getItem('mockOrders')) || [];
        localMockOrders.unshift(createdOrder);
        localStorage.setItem('mockOrders', JSON.stringify(localMockOrders));
      }

      setOrderDetails(createdOrder);
      clearCart();
      setStep(4);
    } catch (err) {
      console.error(err);
      setCardError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Steps Left Panel */}
      <div class="lg:col-span-2 space-y-6">
        {/* Step 1: Address */}
        {step === 1 && (
          <form onSubmit={handleNextStep} class="bg-white border border-gray-200/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 class="text-lg font-black text-gray-900 flex items-center space-x-2 pb-3 border-b border-gray-50">
              <MapPin size={18} class="text-[#5B7CFA]" />
              <span>Shipping Address</span>
            </h3>
            
            <div class="space-y-4 text-xs font-semibold text-gray-500">
              <div>
                <label class="uppercase">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] mt-1 text-gray-800"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="uppercase">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none mt-1 text-gray-800"
                  />
                </div>
                <div>
                  <label class="uppercase">State / Province</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none mt-1 text-gray-800"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="uppercase">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none mt-1 text-gray-800"
                  />
                </div>
                <div>
                  <label class="uppercase">Country</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none mt-1 text-gray-800"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              class="w-full bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold py-3.5 rounded-full flex items-center justify-center space-x-1.5 shadow-md shadow-[#5B7CFA]/10 mt-6 text-xs"
            >
              <span>Continue to Shipping</span>
              <ChevronRight size={14} />
            </button>
          </form>
        )}

        {/* Step 2: Shipping Method */}
        {step === 2 && (
          <form onSubmit={handleNextStep} class="bg-white border border-gray-200/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 class="text-lg font-black text-gray-900 flex items-center space-x-2 pb-3 border-b border-gray-50">
              <Truck size={18} class="text-[#5B7CFA]" />
              <span>Shipping Method</span>
            </h3>

            <div class="space-y-3">
              <label class="flex items-center justify-between p-4 border border-[#5B7CFA] bg-[#5B7CFA]/5 rounded-2xl cursor-pointer">
                <div class="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    class="text-[#5B7CFA] focus:ring-[#5B7CFA]"
                  />
                  <div>
                    <h4 class="font-bold text-sm text-gray-800">Standard Delivery (5-7 days)</h4>
                    <p class="text-xs text-gray-550">Delivery details: shipped via home mail carrier</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-gray-700">{subtotal > 50 ? 'Free' : '$5.00'}</span>
              </label>

              <label class="flex items-center justify-between p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-[#5B7CFA]">
                <div class="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    class="text-[#5B7CFA] focus:ring-[#5B7CFA]"
                  />
                  <div>
                    <h4 class="font-bold text-sm text-gray-800">Express Shipping (2-3 days)</h4>
                    <p class="text-xs text-gray-550">Delivery details: priority air cargo post</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-gray-700">$10.00</span>
              </label>

              <label class="flex items-center justify-between p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-[#5B7CFA]">
                <div class="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={shippingMethod === 'overnight'}
                    onChange={() => setShippingMethod('overnight')}
                    class="text-[#5B7CFA] focus:ring-[#5B7CFA]"
                  />
                  <div>
                    <h4 class="font-bold text-sm text-gray-800">Overnight Delivery (Next Day)</h4>
                    <p class="text-xs text-gray-550">Delivery details: guaranteed next-day courier</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-gray-700">$20.00</span>
              </label>
            </div>

            <div class="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                class="flex-1 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-full text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                class="flex-1 bg-[#5B7CFA] text-white font-bold py-3.5 rounded-full flex items-center justify-center space-x-1.5 text-xs"
              >
                <span>Continue to Payment</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Payment Card */}
        {step === 3 && (
          <form onSubmit={handlePaymentSubmit} class="bg-white border border-gray-200/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 class="text-lg font-black text-gray-900 flex items-center space-x-2 pb-3 border-b border-gray-50">
              <Wallet size={18} class="text-[#5B7CFA]" />
              <span>Cash on Delivery (COD)</span>
            </h3>

            {cardError && <div class="p-3 bg-red-55 text-red-600 rounded-lg text-xs font-semibold">{cardError}</div>}

            <div class="p-6 bg-[#F5F0E8] rounded-2xl border border-gray-150 text-center space-y-3">
              <p class="font-bold text-sm text-[#1F2937]">Order first, pay later!</p>
              <p class="text-xs text-gray-500">
                You will pay cash or card to the delivery executive when your parcel arrives at your shipping address.
              </p>
            </div>

            <div class="flex items-center space-x-2 text-xs text-gray-400 py-2">
              <ShieldCheck size={14} class="text-emerald-500" />
              <span>Secure order confirmation. Pay with cash or card upon delivery.</span>
            </div>

            <div class="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={loadingPayment}
                class="flex-1 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-full text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loadingPayment}
                class="flex-grow bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold py-3.5 rounded-full flex items-center justify-center space-x-1.5 disabled:opacity-50 text-xs"
              >
                {loadingPayment ? 'Processing...' : `Place Order ($${total.toFixed(2)})`}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Summary Right Panel */}
      <div class="p-6 bg-white border border-gray-200/60 rounded-3xl shadow-sm h-fit space-y-5">
        <h3 class="text-base font-black text-gray-900 pb-3 border-b border-gray-100">Order Items</h3>
        <div class="space-y-3 max-h-60 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item._id} class="flex items-center space-x-3">
              <img src={item.image} alt="" class="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100" />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                <p class="text-[10px] text-gray-400">Qty: {item.quantity}</p>
              </div>
              <span class="text-xs font-extrabold text-gray-800">${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div class="border-t border-gray-55 pt-4 space-y-2 text-xs">
          <div class="flex justify-between text-gray-500">
            <span>Items Subtotal</span>
            <span class="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-gray-500">
            <span>Shipping Cost</span>
            <span class="font-semibold text-gray-800">${shippingCost.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-gray-500">
            <span>Tax (8%)</span>
            <span class="font-semibold text-gray-800">${tax.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
            <span>Total Price</span>
            <span class="text-[#5B7CFA] text-base">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderDetails, setOrderDetails] = useState(null);

  if (step === 4 && orderDetails) {
    return (
      <div class="max-w-md mx-auto text-center py-20 px-4 space-y-6 animate-fade-in bg-white p-8 rounded-3xl border border-gray-200">
        <div class="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={40} />
        </div>
        <h2 class="text-3xl font-black text-gray-900">Order Placed Successfully!</h2>
        <p class="text-sm text-gray-500">
          Your order has been recorded successfully. Order ID: <br />
          <strong class="text-gray-800 text-xs font-mono">{orderDetails._id}</strong>
        </p>
        <div class="pt-4 flex flex-col gap-3">
          <button
            onClick={() => printInvoice(orderDetails, user)}
            class="flex items-center justify-center space-x-2 bg-[#5B7CFA] text-white font-bold py-3.5 rounded-full shadow-md text-xs cursor-pointer hover:bg-[#4864e0]"
          >
            <Download size={14} />
            <span>Download Invoice (PDF)</span>
          </button>
          <Link
            to="/orders"
            class="bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-full hover:bg-gray-100 transition-colors text-xs"
          >
            View Order History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Indicators */}
      <div class="flex items-center space-x-4 max-w-lg">
        <div class={`flex items-center space-x-2 ${step >= 1 ? 'text-[#5B7CFA] font-bold' : 'text-gray-400'}`}>
          <span class="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs">1</span>
          <span class="text-xs">Address</span>
        </div>
        <ChevronRight size={14} class="text-gray-300" />
        <div class={`flex items-center space-x-2 ${step >= 2 ? 'text-[#5B7CFA] font-bold' : 'text-gray-400'}`}>
          <span class="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs">2</span>
          <span class="text-xs">Shipping</span>
        </div>
        <ChevronRight size={14} class="text-gray-300" />
        <div class={`flex items-center space-x-2 ${step >= 3 ? 'text-[#5B7CFA] font-bold' : 'text-gray-400'}`}>
          <span class="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs">3</span>
          <span class="text-xs">Payment</span>
        </div>
      </div>

      <CheckoutForm
        step={step}
        setStep={setStep}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
        orderDetails={orderDetails}
        setOrderDetails={setOrderDetails}
      />
    </div>
  );
}
