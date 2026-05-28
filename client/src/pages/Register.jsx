import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { User, Mail, Lock, X } from 'lucide-react';

export default function Register() {
  const { register, user, error, loading } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    const res = await register(name, email, password);
    if (!res.success) {
      setLocalError(res.error);
    }
  };

  return (
    <div class="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 bg-[#E5E7EB] rounded-3xl">
      <div class="relative w-full max-w-sm">
        
        {/* Close Button */}
        <Link to="/" class="absolute right-4 top-2 text-gray-700 hover:text-black transition-colors z-20">
          <X size={28} strokeWidth={1.5} />
        </Link>

        {/* Floating Profile Icon */}
        <div class="absolute left-1/2 -top-16 -translate-x-1/2 w-32 h-32 rounded-full bg-[#E5E7EB] flex items-center justify-center z-10">
          <div class="w-[114px] h-[114px] rounded-full bg-[#063C54] overflow-hidden relative flex flex-col items-center justify-center border-4 border-white">
            <div class="w-8 h-8 rounded-full bg-white mb-1 mt-3" />
            <div class="w-16 h-12 bg-sky-900/60 rounded-t-full" />
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          class="relative bg-white rounded-[40px] pt-20 pb-0 overflow-hidden shadow-lg border border-gray-100 flex flex-col mt-4"
        >
          <div class="px-8 space-y-5 pb-6">
            
            {/* Error Message */}
            {(localError || error) && (
              <div class="p-2.5 bg-red-50 text-red-650 rounded-xl text-center text-xs font-semibold">
                {localError || error}
              </div>
            )}

            {/* Name Field */}
            <div class="flex items-center space-x-3">
              <div class="text-[#063C54] p-1">
                <User size={22} fill="currentColor" class="text-white stroke-[#063C54]" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                class="flex-grow bg-[#578294] text-white placeholder-white/80 italic text-sm font-medium rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-[#063C54]"
              />
            </div>

            {/* Email Field */}
            <div class="flex items-center space-x-3">
              <div class="text-[#063C54] p-1">
                <Mail size={22} fill="currentColor" class="text-white stroke-[#063C54]" strokeWidth={2.5} />
              </div>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                class="flex-grow bg-[#578294] text-white placeholder-white/80 italic text-sm font-medium rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-[#063C54]"
              />
            </div>

            {/* Password Field */}
            <div class="flex items-center space-x-3">
              <div class="text-[#063C54] p-1">
                <Lock size={22} fill="currentColor" class="text-[#063C54]" strokeWidth={2} />
              </div>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                class="flex-grow bg-[#578294] text-white placeholder-white/80 italic text-sm font-medium rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-[#063C54]"
              />
            </div>

            {/* Confirm Password Field */}
            <div class="flex items-center space-x-3">
              <div class="text-[#063C54] p-1">
                <Lock size={22} fill="currentColor" class="text-[#063C54]" strokeWidth={2} />
              </div>
              <input
                type="password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                class="flex-grow bg-[#578294] text-white placeholder-white/80 italic text-sm font-medium rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-[#063C54]"
              />
            </div>

            {/* Terms checkbox */}
            <div class="flex items-center space-x-2 text-xs font-semibold text-[#063C54] pt-1">
              <label class="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                  class="rounded border-2 border-[#063C54] text-[#063C54] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span class="italic">Agree to terms & conditions</span>
              </label>
            </div>
          </div>

          {/* Footer Submit Button */}
          <button
            type="submit"
            disabled={loading}
            class="w-full bg-[#063C54] hover:bg-[#002e42] text-white font-extrabold tracking-widest text-2xl py-5 transition-colors focus:outline-none uppercase"
          >
            {loading ? 'creating...' : 'register'}
          </button>
        </form>
      </div>

      {/* Outside Login Link */}
      <div class="text-center mt-6">
        <Link to="/login" class="text-xs font-semibold text-[#1F2937] italic underline hover:text-[#063C54]">
          already have an account? sign in
        </Link>
      </div>
    </div>
  );
}
