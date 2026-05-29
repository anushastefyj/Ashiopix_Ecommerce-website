import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Wishlist from './pages/Wishlist';

// Protected Route helper
function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" replace />;
}

// Admin Route helper
function AdminRoute({ children }) {
  const { user } = useAuthStore();
  return user && user.role === 'admin' ? children : <Navigate to="/not-found" replace />;
}

import { useLocation } from 'react-router-dom';

// Dynamic Layout Wrapper to apply borders conditionally
function MainLayout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div class={`flex flex-col min-h-screen bg-[#F5F0E8] text-[#1F2937] ${!isHome ? 'app-page-borders' : ''}`}>
      <Navbar />
      
      {/* Main Content Area */}
      <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Premium Footer */}
      <footer class="border-t border-gray-200 bg-[#F5F0E8] py-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} ASHIOPIX - Pixels of Perfect Shopping. Protected under SSL certification.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Client Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallbacks */}
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
