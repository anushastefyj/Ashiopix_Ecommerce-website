import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useCartStore } from '../context/cartStore';
import {
  User,
  MapPin,
  Pencil,
  ShoppingBag,
  Ticket,
  Lock,
  LogOut,
  ChevronRight,
  Bell,
  ArrowLeft,
  Save,
  Download,
  Eye,
  FileText
} from 'lucide-react';
import { printInvoice } from '../utils/invoice';

export default function Account() {
  const { user, updateProfile, updateAddress, logout } = useAuthStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  // Address Form State
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || '');
  const [addressMsg, setAddressMsg] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Coupons List
  const coupons = [
    { code: 'ASHIO20', discount: '20% OFF', desc: 'On all organic linen trench coats', minPurchase: '$100' },
    { code: 'WELCOME10', discount: '10% OFF', desc: 'On your next purchase', minPurchase: 'None' },
    { code: 'FREESHIP', discount: 'FREE SHIPPING', desc: 'Standard shipping coupon', minPurchase: '$50' },
  ];

  // Fetch orders locally and from backend
  const fetchLocalOrders = async () => {
    setOrdersLoading(true);
    try {
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders')) || [];
      setOrders(mockOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'orders') {
      fetchLocalOrders();
    }
  }, [tab]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');

    const res = await updateProfile({ name, email, phone });
    if (res.success) {
      setProfileMsg('Profile details updated successfully!');
    } else {
      setProfileErr(res.error || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');

    if (newPassword !== confirmPassword) {
      setPasswordErr('New passwords do not match');
      return;
    }

    const res = await updateProfile({ password: newPassword });
    if (res.success) {
      setPasswordMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordErr(res.error || 'Failed to change password');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressMsg('');

    const res = await updateAddress({ street, city, state, postalCode, country });
    if (res.success) {
      setAddressMsg('Shipping details updated successfully!');
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div class={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6 ${darkMode ? 'brightness-90 bg-gray-900 text-white rounded-3xl p-4 transition-all' : 'transition-all'}`}>
      
      {/* Mobile/Header Navigation Bar mimicking the screenshot */}
      <div class="flex items-center justify-between bg-white border border-gray-150 rounded-2xl px-4 py-3.5 shadow-sm">
        <button onClick={() => navigate(-1)} class="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 flex items-center justify-center transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h1 class="text-base font-extrabold text-[#1F2937] tracking-tight">Settings</h1>
        <button class="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 flex items-center justify-center relative transition-colors">
          <Bell size={16} />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      {/* Main Settings Horizontal layout */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side Menu List (Matches screenshot UI) */}
        <div class="lg:col-span-1 space-y-5">
          
          {/* User Profile Header Card */}
          <div class="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
            <div class="w-14 h-14 rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-[#5B7CFA] text-lg shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-sm font-extrabold text-[#1F2937] truncate">{user?.name || 'Subaida Rahman'}</h2>
              <p class="text-xs text-gray-400 truncate">{user?.email || 'subaidarahman22@gmail.com'}</p>
            </div>
          </div>

          {/* Preferences bar (Language Dropdown & Dark Mode Toggle) */}
          <div class="bg-white border border-gray-150 rounded-3xl px-5 py-4 shadow-sm flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
            {/* Language Select */}
            <div class="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                class="flex items-center space-x-1 text-gray-500 hover:text-gray-800 transition-colors"
              >
                <span>{language}</span>
                <ChevronRight size={14} class="rotate-90" />
              </button>
              {dropdownOpen && (
                <>
                  <div onClick={() => setDropdownOpen(false)} class="fixed inset-0 z-20" />
                  <div class="absolute left-0 mt-2 w-32 bg-white border border-gray-100 rounded-2xl shadow-premium py-1 z-30 text-gray-700 capitalize">
                    {['English', 'Spanish', 'French'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setDropdownOpen(false);
                        }}
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs font-bold"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Switch */}
            <div class="flex items-center space-x-3">
              <span class="text-gray-400">Dark Mode</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                class={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 ${
                  darkMode ? 'bg-[#5B7CFA]' : 'bg-gray-200'
                }`}
              >
                <div class={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-all duration-300 ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Settings Options Items Vertical List */}
          <div class="space-y-3">
            
            {/* Edit Profile */}
            <button
              onClick={() => setTab('profile')}
              class={`w-full bg-white border p-4.5 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 ${
                tab === 'profile' ? 'border-[#5B7CFA] bg-[#5B7CFA]/5 text-[#5B7CFA]' : 'border-gray-150 text-gray-500 hover:border-blue-200'
              }`}
            >
              <div class="flex items-center space-x-3.5">
                <Pencil size={18} class={tab === 'profile' ? 'text-[#5B7CFA]' : 'text-gray-400'} />
                <span class="text-xs font-bold text-gray-700 group-hover:text-gray-900">Edit Profile</span>
              </div>
              <ChevronRight size={14} class="text-gray-300" />
            </button>

            {/* Order History */}
            <button
              onClick={() => setTab('orders')}
              class={`w-full bg-white border p-4.5 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 ${
                tab === 'orders' ? 'border-[#5B7CFA] bg-[#5B7CFA]/5 text-[#5B7CFA]' : 'border-gray-150 text-gray-500 hover:border-blue-200'
              }`}
            >
              <div class="flex items-center space-x-3.5">
                <ShoppingBag size={18} class={tab === 'orders' ? 'text-[#5B7CFA]' : 'text-gray-400'} />
                <span class="text-xs font-bold text-gray-700 group-hover:text-gray-900">Order History</span>
              </div>
              <ChevronRight size={14} class="text-gray-300" />
            </button>

            {/* Shipping Details */}
            <button
              onClick={() => setTab('shipping')}
              class={`w-full bg-white border p-4.5 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 ${
                tab === 'shipping' ? 'border-[#5B7CFA] bg-[#5B7CFA]/5 text-[#5B7CFA]' : 'border-gray-150 text-gray-500 hover:border-blue-200'
              }`}
            >
              <div class="flex items-center space-x-3.5">
                <MapPin size={18} class={tab === 'shipping' ? 'text-[#5B7CFA]' : 'text-gray-400'} />
                <span class="text-xs font-bold text-gray-700 group-hover:text-gray-900">Shipping Details</span>
              </div>
              <ChevronRight size={14} class="text-gray-300" />
            </button>

            {/* All Coupons */}
            <button
              onClick={() => setTab('coupons')}
              class={`w-full bg-white border p-4.5 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 ${
                tab === 'coupons' ? 'border-[#5B7CFA] bg-[#5B7CFA]/5 text-[#5B7CFA]' : 'border-gray-150 text-gray-500 hover:border-blue-200'
              }`}
            >
              <div class="flex items-center space-x-3.5">
                <Ticket size={18} class={tab === 'coupons' ? 'text-[#5B7CFA]' : 'text-gray-400'} />
                <span class="text-xs font-bold text-gray-700 group-hover:text-gray-900">All Coupons</span>
              </div>
              <ChevronRight size={14} class="text-gray-300" />
            </button>

            {/* Change Password */}
            <button
              onClick={() => setTab('password')}
              class={`w-full bg-white border p-4.5 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 ${
                tab === 'password' ? 'border-[#5B7CFA] bg-[#5B7CFA]/5 text-[#5B7CFA]' : 'border-gray-150 text-gray-500 hover:border-blue-200'
              }`}
            >
              <div class="flex items-center space-x-3.5">
                <Lock size={18} class={tab === 'password' ? 'text-[#5B7CFA]' : 'text-gray-400'} />
                <span class="text-xs font-bold text-gray-700 group-hover:text-gray-900">Change Password</span>
              </div>
              <ChevronRight size={14} class="text-gray-300" />
            </button>

            {/* Log Out */}
            <button
              onClick={handleLogoutClick}
              class="w-full bg-white border border-gray-150 p-4.5 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200"
            >
              <div class="flex items-center space-x-3.5">
                <LogOut size={18} class="text-red-400 group-hover:text-red-600" />
                <span class="text-xs font-bold text-red-600">Log Out</span>
              </div>
              <ChevronRight size={14} class="text-gray-300" />
            </button>

          </div>
        </div>

        {/* Right Side Control Forms / Panel */}
        <div class="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* TAB 1: Edit Profile details */}
          {tab === 'profile' && (
            <form onSubmit={handleProfileSubmit} class="space-y-6">
              <h2 class="text-lg font-black text-gray-900 border-b border-gray-50 pb-3">Edit Profile Information</h2>
              {profileMsg && <div class="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-semibold">{profileMsg}</div>}
              {profileErr && <div class="p-3 bg-red-55 text-red-600 rounded-xl text-xs font-semibold">{profileErr}</div>}

              <div class="space-y-4 text-xs font-semibold text-gray-500">
                <div>
                  <label class="uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] mt-1 text-gray-800"
                  />
                </div>
                <div>
                  <label class="uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] mt-1 text-gray-800"
                  />
                </div>
                <div>
                  <label class="uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] mt-1 text-gray-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                class="bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold py-3.5 px-6 rounded-full flex items-center space-x-1.5 shadow-md shadow-[#5B7CFA]/10 text-xs cursor-pointer"
              >
                <Save size={14} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* TAB 2: Shipping details */}
          {tab === 'shipping' && (
            <form onSubmit={handleAddressSubmit} class="space-y-6">
              <h2 class="text-lg font-black text-gray-900 border-b border-gray-50 pb-3">Shipping Address</h2>
              {addressMsg && <div class="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-semibold">{addressMsg}</div>}

              <div class="space-y-4 text-xs font-semibold text-gray-500">
                <div>
                  <label class="uppercase">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] mt-1 text-gray-800"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="uppercase">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none mt-1 text-gray-800"
                    />
                  </div>
                  <div>
                    <label class="uppercase">State / Province</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
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
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none mt-1 text-gray-800"
                    />
                  </div>
                  <div>
                    <label class="uppercase">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none mt-1 text-gray-800"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                class="bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold py-3.5 px-6 rounded-full flex items-center space-x-1.5 shadow-md shadow-[#5B7CFA]/10 text-xs cursor-pointer"
              >
                <Save size={14} />
                <span>Save Address Changes</span>
              </button>
            </form>
          )}

          {/* TAB 3: Change Password */}
          {tab === 'password' && (
            <form onSubmit={handlePasswordSubmit} class="space-y-6">
              <h2 class="text-lg font-black text-gray-900 border-b border-gray-50 pb-3">Change Password</h2>
              {passwordMsg && <div class="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-semibold">{passwordMsg}</div>}
              {passwordErr && <div class="p-3 bg-red-55 text-red-600 rounded-xl text-xs font-semibold">{passwordErr}</div>}

              <div class="space-y-4 text-xs font-semibold text-gray-500">
                <div>
                  <label class="uppercase">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] mt-1 text-gray-800"
                  />
                </div>
                <div>
                  <label class="uppercase">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] mt-1 text-gray-800"
                  />
                </div>
                <div>
                  <label class="uppercase">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] mt-1 text-gray-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                class="bg-[#5B7CFA] hover:bg-[#4864e0] text-white font-bold py-3.5 px-6 rounded-full flex items-center space-x-1.5 shadow-md shadow-[#5B7CFA]/10 text-xs cursor-pointer"
              >
                <Save size={14} />
                <span>Update Password</span>
              </button>
            </form>
          )}

          {/* TAB 4: Coupons list */}
          {tab === 'coupons' && (
            <div class="space-y-6">
              <h2 class="text-lg font-black text-gray-900 border-b border-gray-50 pb-3">All Active Coupons</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon, i) => (
                  <div key={i} class="bg-[#F5F0E8] border border-gray-200 p-5 rounded-2xl relative overflow-hidden group">
                    {/* Decorative side notches to look like a ticket */}
                    <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-r border-gray-200" />
                    <div class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-l border-gray-200" />
                    
                    <div class="pl-3 pr-3 space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="bg-[#5B7CFA]/10 text-[#5B7CFA] text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full">
                          {coupon.discount}
                        </span>
                        <span class="text-[10px] text-gray-400 font-bold uppercase">Min: {coupon.minPurchase}</span>
                      </div>
                      <h3 class="text-base font-black text-[#1F2937] tracking-tight">{coupon.code}</h3>
                      <p class="text-xs text-gray-500 font-medium">{coupon.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Order History nested directly */}
          {tab === 'orders' && (
            <div class="space-y-6">
              <div class="flex justify-between items-center pb-3 border-b border-gray-50">
                <h2 class="text-lg font-black text-gray-900">Purchase History</h2>
                <button
                  onClick={fetchLocalOrders}
                  class="text-[10px] uppercase font-bold text-[#5B7CFA] hover:text-[#4864e0]"
                >
                  Sync list
                </button>
              </div>

              {ordersLoading ? (
                <div class="flex justify-center py-10">
                  <div class="w-6 h-6 border-3 border-[#5B7CFA] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div class="text-center py-12 space-y-3">
                  <div class="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag size={20} />
                  </div>
                  <p class="text-xs text-gray-400 italic">No orders found on this account.</p>
                </div>
              ) : (
                <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      class="bg-white border border-gray-150 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#5B7CFA]/30 transition-colors shadow-sm"
                    >
                      <div class="grid grid-cols-2 gap-4 flex-1">
                        <div>
                          <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">ID</span>
                          <span class="text-[10px] font-mono font-bold text-gray-700 block truncate max-w-[100px]">
                            {order._id}
                          </span>
                        </div>
                        <div>
                          <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Date</span>
                          <span class="text-[10px] font-semibold text-gray-700 block">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total</span>
                          <span class="text-[10px] font-black text-gray-900 block">${order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Status</span>
                          <span class="inline-block text-[9px] font-extrabold text-[#5B7CFA] bg-[#5B7CFA]/10 px-2 py-0.5 rounded-full">
                            {order.orderStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div class="flex items-center space-x-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          class="flex items-center space-x-1 border border-gray-150 rounded-full px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:bg-gray-50"
                        >
                          <Eye size={10} />
                          <span>Details</span>
                        </button>
                        <button
                          onClick={() => printInvoice(order, user)}
                          class="flex items-center space-x-1 bg-[#5B7CFA]/10 text-[#5B7CFA] rounded-full px-3 py-1.5 text-[10px] font-bold hover:bg-[#5B7CFA]/20"
                        >
                          <FileText size={10} />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Embedded Order Details Modal */}
      {selectedOrder && (
        <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-xl">
            <div class="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 class="font-black text-gray-900 text-base">Order Details</h3>
                <span class="text-[10px] text-gray-400 font-mono">#{selectedOrder._id}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                class="text-xs text-gray-400 hover:text-gray-700 font-bold"
              >
                Close
              </button>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Shipping Destination</h4>
              <p class="text-xs font-semibold text-gray-800">
                {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}
              </p>
              <p class="text-[11px] text-gray-500">
                {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-1.5">Products</h4>
              <div class="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedOrder.orderItems.map((item, i) => (
                  <div key={i} class="flex items-center space-x-3">
                    <img src={item.image} alt="" class="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                      <p class="text-[9px] text-gray-400">Qty: {item.qty} @ ${item.price.toFixed(2)}</p>
                    </div>
                    <span class="text-xs font-extrabold text-gray-800">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div class="border-t border-gray-100 pt-3 flex flex-col items-end space-y-1 text-xs text-gray-500">
              <div class="flex justify-between w-40">
                <span>Subtotal:</span>
                <span class="font-semibold text-gray-800">${selectedOrder.itemsPrice.toFixed(2)}</span>
              </div>
              <div class="flex justify-between w-40">
                <span>Shipping:</span>
                <span class="font-semibold text-gray-800">${selectedOrder.shippingPrice.toFixed(2)}</span>
              </div>
              <div class="flex justify-between w-40">
                <span>Tax:</span>
                <span class="font-semibold text-gray-800">${selectedOrder.taxPrice.toFixed(2)}</span>
              </div>
              <div class="flex justify-between w-40 text-xs font-black text-gray-900 border-t border-gray-50 pt-2">
                <span>Grand Total:</span>
                <span class="text-[#5B7CFA] font-extrabold">${selectedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
