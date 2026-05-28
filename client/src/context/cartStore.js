import { create } from 'zustand';
import { api } from './authStore.js';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    // If not logged in, load from local storage
    const token = localStorage.getItem('token');
    if (!token) {
      const items = JSON.parse(localStorage.getItem('cartItems')) || [];
      set({ cartItems: items, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/cart');
      // Backend returns cart model containing items array: { items: [ { product, quantity } ] }
      const formattedItems = data.items.map((item) => ({
        ...item.product,
        quantity: item.quantity,
        productId: item.product._id, // compatibility helper
      }));
      set({ cartItems: formattedItems, loading: false });
      localStorage.setItem('cartItems', JSON.stringify(formattedItems));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch cart', loading: false });
    }
  },

  addToCart: async (product, quantity = 1) => {
    const token = localStorage.getItem('token');
    const items = get().cartItems;
    const existingItem = items.find((item) => item._id === product._id);
    let updatedItems;

    if (existingItem) {
      updatedItems = items.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [...items, { ...product, quantity }];
    }

    set({ cartItems: updatedItems });
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    // If logged in, sync with server
    if (token) {
      try {
        await api.post('/cart/add', { productId: product._id, quantity });
      } catch (err) {
        console.error('Failed to sync add to cart with server', err);
      }
    }
  },

  removeFromCart: async (productId) => {
    const token = localStorage.getItem('token');
    const items = get().cartItems;
    const updatedItems = items.filter((item) => item._id !== productId);

    set({ cartItems: updatedItems });
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    if (token) {
      try {
        await api.delete(`/cart/${productId}`);
      } catch (err) {
        console.error('Failed to sync remove from cart with server', err);
      }
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity < 1) return;
    const token = localStorage.getItem('token');
    const items = get().cartItems;
    const updatedItems = items.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );

    set({ cartItems: updatedItems });
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    if (token) {
      try {
        await api.put(`/cart/${productId}`, { quantity });
      } catch (err) {
        console.error('Failed to sync quantity update with server', err);
      }
    }
  },

  clearCart: async () => {
    const token = localStorage.getItem('token');
    set({ cartItems: [] });
    localStorage.removeItem('cartItems');

    if (token) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error('Failed to sync clear cart with server', err);
      }
    }
  },

  getTotalPrice: () => {
    return get().cartItems.reduce(
      (total, item) => total + (item.discountPrice || item.price) * item.quantity,
      0
    );
  },

  getTotalItems: () => {
    return get().cartItems.reduce((total, item) => total + item.quantity, 0);
  },
}));
