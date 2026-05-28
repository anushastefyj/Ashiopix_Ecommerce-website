import React, { useEffect, useState } from 'react';
import { useAuthStore, api } from '../context/authStore';
import { Package, FileText, ChevronRight, Eye, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { printInvoice } from '../utils/invoice';

export default function OrderHistory() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders')) || [];
      const mergedOrders = [...data, ...mockOrders.filter(mo => !data.some(o => o._id === mo._id))];
      setOrders(mergedOrders);
    } catch (err) {
      console.error('Failed to fetch orders from server, loading local history:', err);
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders')) || [];
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div class="flex justify-between items-center pb-6 border-b border-gray-100">
        <div>
          <h1 class="text-3xl font-black text-gray-900">Order History</h1>
          <p class="text-sm text-gray-500 mt-0.5">Track your purchases and download invoices</p>
        </div>
        <button
          onClick={fetchOrders}
          class="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-500"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {loading ? (
        <div class="flex justify-center py-20">
          <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div class="text-center py-20 max-w-sm mx-auto space-y-4">
          <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Package size={28} />
          </div>
          <h3 class="font-bold text-gray-800">No Orders Found</h3>
          <p class="text-sm text-gray-500">You haven't placed any orders yet on this account.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              class="bg-white border border-gray-150 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-colors shadow-sm"
            >
              {/* Order Meta info */}
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                <div>
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Order ID</span>
                  <span class="text-xs font-mono font-bold text-gray-700 block truncate max-w-[120px]">
                    {order._id}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Date Placed</span>
                  <span class="text-xs font-semibold text-gray-700 block">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Paid</span>
                  <span class="text-xs font-black text-gray-900 block">${order.totalPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Status</span>
                  <span
                    class={`inline-block text-[10px] font-bold rounded-full px-2.5 py-1 mt-0.5 border ${
                      order.orderStatus === 'delivered'
                        ? 'bg-green-50 text-green-700 border-green-150'
                        : order.orderStatus === 'cancelled'
                        ? 'bg-red-50 text-red-700 border-red-150'
                        : 'bg-blue-50 text-blue-700 border-blue-150'
                    }`}
                  >
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Actions row */}
              <div class="flex items-center space-x-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-55">
                <button
                  onClick={() => setSelectedOrder(order)}
                  class="flex items-center space-x-1 border border-gray-200 rounded-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  <Eye size={12} />
                  <span>Details</span>
                </button>
                <button
                  onClick={() => printInvoice(order, user)}
                  class="flex items-center space-x-1 bg-blue-50 text-blue-600 rounded-full px-4 py-2 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                >
                  <FileText size={12} />
                  <span>Invoice (PDF)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-slide-up shadow-xl">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 class="font-bold text-gray-900 text-lg">Order Details</h3>
                <span class="text-xs text-gray-400 font-mono">#{selectedOrder._id}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                class="text-gray-400 hover:text-gray-700 font-bold"
              >
                Close
              </button>
            </div>

            {/* Delivery address */}
            <div class="bg-gray-50 p-4 rounded-2xl border border-gray-50">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Destination</h4>
              <p class="text-sm font-semibold text-gray-800">
                {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}
              </p>
              <p class="text-sm text-gray-500">
                {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
              </p>
            </div>

            {/* Items */}
            <div class="space-y-4">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2">Products Purchased</h4>
              <div class="space-y-3">
                {selectedOrder.orderItems.map((item, i) => (
                  <div key={i} class="flex items-center space-x-3">
                    <img src={item.image} alt="" class="w-12 h-12 rounded-lg object-cover bg-gray-50" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                      <p class="text-[10px] text-gray-400">Qty: {item.qty} @ ${item.price.toFixed(2)}</p>
                    </div>
                    <span class="text-xs font-extrabold text-gray-800">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div class="border-t border-gray-100 pt-4 flex flex-col items-end space-y-1.5 text-xs text-gray-500">
              <div class="flex justify-between w-48">
                <span>Subtotal:</span>
                <span class="font-semibold text-gray-800">${selectedOrder.itemsPrice.toFixed(2)}</span>
              </div>
              <div class="flex justify-between w-48">
                <span>Shipping:</span>
                <span class="font-semibold text-gray-800">${selectedOrder.shippingPrice.toFixed(2)}</span>
              </div>
              <div class="flex justify-between w-48">
                <span>Tax:</span>
                <span class="font-semibold text-gray-800">${selectedOrder.taxPrice.toFixed(2)}</span>
              </div>
              <div class="flex justify-between w-48 text-sm font-black text-gray-900 border-t border-gray-50 pt-2">
                <span>Grand Total:</span>
                <span class="text-blue-600">${selectedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
