import React, { useEffect, useState } from 'react';
import { api } from '../../context/authStore';
import { Shield, DollarSign, ShoppingBag, Users, Plus, Edit, Trash2, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms states
  const [productForm, setProductForm] = useState({
    _id: '',
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    image: '',
    brand: '',
    category: '',
    stock: '',
  });
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordRes, usrRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/products'),
        api.get('/admin/orders'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
      setUsers(usrRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/products', productForm);
      } else {
        await api.put(`/products/${productForm._id}`, productForm);
      }
      setShowProductModal(false);
      resetProductForm();
      loadAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Product save failed');
    }
  };

  const handleEditClick = (product) => {
    setProductForm(product);
    setModalMode('edit');
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        loadAllAdminData();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      loadAllAdminData();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      _id: '',
      name: '',
      price: '',
      discountPrice: '',
      description: '',
      image: '',
      brand: '',
      category: '',
      stock: '',
    });
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 class="text-3xl font-black text-gray-900 flex items-center space-x-2">
            <Shield class="text-blue-600" />
            <span>Admin Console</span>
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">Control center for stock, payments, users, and orders</p>
        </div>

        {/* Tab Selector Links */}
        <div class="flex items-center space-x-2 bg-gray-100 p-1 rounded-full self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('stats')}
            class={`px-4 py-2 rounded-full font-bold transition-all ${
              activeTab === 'stats' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            class={`px-4 py-2 rounded-full font-bold transition-all ${
              activeTab === 'products' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            class={`px-4 py-2 rounded-full font-bold transition-all ${
              activeTab === 'orders' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            class={`px-4 py-2 rounded-full font-bold transition-all ${
              activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      {/* Tab: Stats */}
      {activeTab === 'stats' && stats && (
        <div class="space-y-8">
          {/* Metrics Grid */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Revenue</span>
                <h3 class="text-2xl font-black text-gray-900 mt-1">${stats.totalRevenue.toFixed(2)}</h3>
              </div>
              <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <DollarSign size={24} />
              </div>
            </div>

            <div class="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Orders</span>
                <h3 class="text-2xl font-black text-gray-900 mt-1">{stats.totalOrders}</h3>
              </div>
              <div class="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <ShoppingBag size={24} />
              </div>
            </div>

            <div class="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">Registered Customers</span>
                <h3 class="text-2xl font-black text-gray-900 mt-1">{stats.totalCustomers}</h3>
              </div>
              <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Users size={24} />
              </div>
            </div>

            <div class="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">Average Ticket</span>
                <h3 class="text-2xl font-black text-gray-900 mt-1">
                  ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
                </h3>
              </div>
              <div class="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          {/* Recent Orders List */}
          <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 class="text-lg font-black text-gray-900">Recent System Orders</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm border-collapse">
                <thead>
                  <tr class="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                    <th class="py-3 px-4">Order ID</th>
                    <th class="py-3 px-4">Customer</th>
                    <th class="py-3 px-4">Date</th>
                    <th class="py-3 px-4">Total Price</th>
                    <th class="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((ord) => (
                    <tr key={ord._id} class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td class="py-3 px-4 font-mono text-xs">{ord._id}</td>
                      <td class="py-3 px-4 font-semibold text-gray-700">{ord.user?.name || 'Deleted User'}</td>
                      <td class="py-3 px-4 text-gray-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td class="py-3 px-4 font-black text-gray-900">${ord.totalPrice.toFixed(2)}</td>
                      <td class="py-3 px-4 text-center">
                        <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          {ord.orderStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Products */}
      {activeTab === 'products' && (
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-black text-gray-900">Store Catalog</h3>
            <button
              onClick={() => {
                resetProductForm();
                setModalMode('create');
                setShowProductModal(true);
              }}
              class="flex items-center space-x-1.5 bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-xs shadow-md shadow-blue-100"
            >
              <Plus size={14} />
              <span>Add New Product</span>
            </button>
          </div>

          <div class="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm border-collapse">
                <thead>
                  <tr class="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase bg-gray-50/50">
                    <th class="py-4 px-6">Product</th>
                    <th class="py-4 px-6">Category</th>
                    <th class="py-4 px-6">Price</th>
                    <th class="py-4 px-6">Stock Left</th>
                    <th class="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id} class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td class="py-4 px-6 flex items-center space-x-3">
                        <img src={prod.image} alt="" class="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                        <div>
                          <span class="font-bold text-gray-800 block">{prod.name}</span>
                          <span class="text-xs text-gray-400 font-medium">{prod.brand}</span>
                        </div>
                      </td>
                      <td class="py-4 px-6 font-semibold text-gray-600">{prod.category}</td>
                      <td class="py-4 px-6 font-black text-gray-900">${prod.price.toFixed(2)}</td>
                      <td class="py-4 px-6 font-bold text-gray-500">{prod.stock} items</td>
                      <td class="py-4 px-6 text-center">
                        <div class="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditClick(prod)}
                            class="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            class="p-2 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div class="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase bg-gray-50/50">
                  <th class="py-4 px-6">Order ID</th>
                  <th class="py-4 px-6">Customer</th>
                  <th class="py-4 px-6">Grand Total</th>
                  <th class="py-4 px-6">Payment Status</th>
                  <th class="py-4 px-6">Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id} class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td class="py-4 px-6 font-mono text-xs">{ord._id}</td>
                    <td class="py-4 px-6">
                      <span class="font-bold text-gray-800 block">{ord.user?.name || 'Deleted'}</span>
                      <span class="text-xs text-gray-400">{ord.user?.email || 'N/A'}</span>
                    </td>
                    <td class="py-4 px-6 font-black text-gray-900">${ord.totalPrice.toFixed(2)}</td>
                    <td class="py-4 px-6">
                      <span
                        class={`inline-block text-[10px] font-bold rounded-full px-2.5 py-0.5 border ${
                          ord.isPaid
                            ? 'bg-green-50 text-green-700 border-green-150'
                            : 'bg-amber-50 text-amber-700 border-amber-150'
                        }`}
                      >
                        {ord.isPaid ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td class="py-4 px-6">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleOrderStatusUpdate(ord._id, e.target.value)}
                        class="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div class="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase bg-gray-50/50">
                  <th class="py-4 px-6">Name</th>
                  <th class="py-4 px-6">Email Address</th>
                  <th class="py-4 px-6">Role Privilege</th>
                  <th class="py-4 px-6">Phone</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usr) => (
                  <tr key={usr._id} class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td class="py-4 px-6 font-bold text-gray-800">{usr.name}</td>
                    <td class="py-4 px-6 text-gray-600 font-medium">{usr.email}</td>
                    <td class="py-4 px-6">
                      <span
                        class={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          usr.role === 'admin'
                            ? 'bg-red-50 text-red-700 border-red-150'
                            : 'bg-gray-50 text-gray-700 border-gray-150'
                        }`}
                      >
                        {usr.role.toUpperCase()}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-gray-500 font-mono text-xs">{usr.phone || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-slide-up shadow-xl">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 class="font-bold text-gray-900 text-lg">
                {modalMode === 'create' ? 'Add New Product' : 'Modify Product'}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  resetProductForm();
                }}
                class="text-gray-400 hover:text-gray-700 font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateProduct} class="space-y-4 text-xs font-semibold text-gray-500">
              <div>
                <label class="uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label class="uppercase">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none mt-1"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="uppercase">Brand</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label class="uppercase">Category</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none mt-1"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="uppercase">Main Image URL</label>
                  <input
                    type="text"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label class="uppercase">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none mt-1"
                  />
                </div>
              </div>

              <div>
                <label class="uppercase">Product Description</label>
                <textarea
                  rows="4"
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none mt-1"
                />
              </div>

              <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full shadow-lg shadow-blue-100 hover:shadow-none transition-all"
              >
                {modalMode === 'create' ? 'Create Product Listing' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
