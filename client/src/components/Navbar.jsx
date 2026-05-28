import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useCartStore } from '../context/cartStore';
import { ShoppingBag, User, LogOut, Shield, Search, Menu, X, Heart } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav class="sticky top-0 z-50 bg-[#F5F0E8]/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          {/* Logo */}
          <div class="flex items-center">
            <Link to="/" class="flex-shrink-0 flex items-center space-x-3 group">
              {/* Custom SVG logo matching the bag and looping arrow */}
              <svg class="w-10 h-10 text-[#7A2021]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3D Shopping bag back/side */}
                <path d="M45 15L75 25V75L45 85V15Z" fill="#7A2021" />
                {/* 3D Shopping bag front */}
                <path d="M45 15L15 28V78L45 85V15Z" fill="#EAEAEA" />
                {/* Handle */}
                <path d="M35 20C35 10 55 10 55 20" stroke="#7A2021" stroke-width="4" stroke-linecap="round" />
                {/* Looping Arrow */}
                <path d="M10 50C10 35 30 30 45 40" stroke="#7A2021" stroke-width="4" stroke-linecap="round" fill="none" />
                <path d="M35 32L48 40L38 48" fill="#7A2021" />
              </svg>
              <div class="flex flex-col">
                <span class="text-xl font-extrabold tracking-wider text-[#7A2021] leading-none uppercase">
                  ASHIOPIX
                </span>
                <span class="text-[9px] font-medium text-gray-500 tracking-tight mt-0.5 whitespace-nowrap">
                  Pixels of Perfect Shopping
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Menu Center */}
          <div class="hidden md:flex items-center space-x-8">
            <Link to="/" class="text-sm font-bold text-[#1F2937] hover:text-[#5B7CFA] transition-colors">
              Home
            </Link>
            <Link to="/products" class="text-sm font-bold text-[#5B7CFA] hover:text-[#4864e0] transition-colors">
              Shop
            </Link>
            <Link to="/about" class="text-sm font-bold text-[#1F2937] hover:text-[#5B7CFA] transition-colors">
              About
            </Link>
            {user && (
              <>
                <Link to="/account" class="text-sm font-bold text-[#1F2937] hover:text-[#5B7CFA] transition-colors">
                  My Account
                </Link>
                <Link to="/wishlist" class="text-sm font-bold text-[#1F2937] hover:text-[#5B7CFA] transition-colors">
                  Wishlist
                </Link>
              </>
            )}
          </div>

          {/* Right side controls */}
          <div class="hidden md:flex items-center space-x-6">
            {/* Search Input Toggle */}
            <form onSubmit={handleSearch} class="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="bg-white/50 border border-gray-300 rounded-full py-1.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] focus:bg-white w-72 focus:w-96 transition-all"
              />
              <button type="submit" class="absolute right-3 top-2 text-gray-500 hover:text-[#5B7CFA]">
                <Search size={14} />
              </button>
            </form>


            {/* Cart Icon */}
            <Link to="/cart" class="text-gray-600 hover:text-[#5B7CFA] transition-colors relative flex items-center">
              <ShoppingBag size={21} />
              {getTotalItems() > 0 && (
                <span class="absolute -top-2 -right-2 bg-[#5B7CFA] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {user ? (
              <div class="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  class="flex items-center space-x-2 text-gray-700 hover:text-[#5B7CFA] focus:outline-none transition-colors"
                >
                  <div class="w-8 h-8 rounded-full bg-[#5B7CFA]/10 text-[#5B7CFA] flex items-center justify-center font-bold text-xs border border-[#5B7CFA]/20">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {dropdownOpen && (
                  <>
                    <div onClick={() => setDropdownOpen(false)} class="fixed inset-0 z-10" />
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-premium py-1 border border-gray-100 z-20">
                      <div class="px-4 py-2 border-b border-gray-50">
                        <p class="text-xs text-gray-400">Signed in as</p>
                        <p class="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                      </div>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          class="flex items-center px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#5B7CFA]"
                        >
                          <Shield size={14} class="mr-2" /> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setDropdownOpen(false)}
                        class="flex items-center px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#5B7CFA]"
                      >
                        <User size={14} class="mr-2" /> Account Settings
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        class="flex items-center px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#5B7CFA]"
                      >
                        <ShoppingBag size={14} class="mr-2" /> My Purchases
                      </Link>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        class="flex w-full text-left items-center px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={14} class="mr-2" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div class="flex items-center space-x-3">
                <Link
                  to="/login"
                  class="text-xs font-bold text-gray-700 hover:text-[#5B7CFA] px-3 py-1.5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  class="text-xs font-bold bg-[#5B7CFA] text-white px-5 py-2.5 rounded-full hover:bg-[#4864e0] shadow-md shadow-[#5B7CFA]/10 hover:shadow-none transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div class="md:hidden flex items-center space-x-4">
            <Link to="/cart" class="text-gray-600 hover:text-[#5B7CFA] relative flex items-center">
              <ShoppingBag size={22} />
              {getTotalItems() > 0 && (
                <span class="absolute -top-2 -right-2 bg-[#5B7CFA] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            <button onClick={() => setIsOpen(!isOpen)} class="text-gray-600 hover:text-[#5B7CFA] focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div class="md:hidden bg-[#F5F0E8] border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 shadow-md animate-slide-up">
          <form onSubmit={handleSearch} class="relative w-full my-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              class="w-full bg-white/60 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#5B7CFA] focus:bg-white"
            />
            <button type="submit" class="absolute right-3 top-2.5 text-gray-400">
              <Search size={18} />
            </button>
          </form>

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            class="block px-3 py-2 rounded-xl text-base font-semibold text-[#1F2937] hover:bg-white/40"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setIsOpen(false)}
            class="block px-3 py-2 rounded-xl text-base font-semibold text-[#1F2937] hover:bg-white/40"
          >
            Shop
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  class="block px-3 py-2 rounded-xl text-base font-semibold text-blue-600 bg-blue-50"
                >
                  Admin Console
                </Link>
              )}
              <Link
                to="/account"
                onClick={() => setIsOpen(false)}
                class="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-white/40"
              >
                Account Settings
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                class="block w-full text-left px-3 py-2 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div class="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                class="text-center text-sm font-semibold text-gray-700 border border-gray-300 py-2.5 rounded-full hover:bg-white/40"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                class="text-center text-sm font-semibold bg-[#5B7CFA] text-white py-2.5 rounded-full hover:bg-[#4864e0]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
