import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div class="max-w-md mx-auto text-center py-24 px-4 space-y-6 animate-fade-in">
      <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <HelpCircle size={36} />
      </div>
      <h1 class="text-4xl font-black text-gray-900">404 - Not Found</h1>
      <p class="text-sm text-gray-500 max-w-xs mx-auto">
        The requested page does not exist or has been relocated to another workspace path.
      </p>
      <Link
        to="/"
        class="inline-block bg-blue-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-blue-100 hover:shadow-none hover:scale-105 transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
}
