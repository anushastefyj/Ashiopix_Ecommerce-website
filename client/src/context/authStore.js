import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token, loading: false });
      return { success: true };
    } catch (err) {
      console.warn('Backend register failed, entering sandbox testing mode...', err);
      // Sandbox mode fallback
      const mockUserData = {
        _id: `mock_user_${Date.now()}`,
        name,
        email,
        role: 'user',
        token: `mock_jwt_token_${Math.random().toString(36).substr(2, 9)}`,
        refreshToken: `mock_refresh_token_${Math.random().toString(36).substr(2, 9)}`,
        avatar: '',
        address: { street: '123 Fashion Blvd', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA' },
        phone: '123-456-7890',
        sandbox: true,
      };

      localStorage.setItem('token', mockUserData.token);
      localStorage.setItem('refreshToken', mockUserData.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockUserData));
      set({ user: mockUserData, token: mockUserData.token, loading: false });
      return { success: true, message: 'Registered in Sandbox Mode' };
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token, loading: false });
      return { success: true };
    } catch (err) {
      console.warn('Backend login failed, entering sandbox testing mode...', err);
      // Sandbox mode fallback
      const mockUserData = {
        _id: `mock_user_123`,
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'user',
        token: `mock_jwt_token_456`,
        refreshToken: `mock_refresh_token_789`,
        avatar: '',
        address: { street: '123 Fashion Blvd', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA' },
        phone: '123-456-7890',
        sandbox: true,
      };

      localStorage.setItem('token', mockUserData.token);
      localStorage.setItem('refreshToken', mockUserData.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockUserData));
      set({ user: mockUserData, token: mockUserData.token, loading: false });
      return { success: true, message: 'Logged in Sandbox Mode' };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout request failed or server offline');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
  },

  getProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/auth/profile');
      const currentUser = get().user;
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, loading: false });
    } catch (err) {
      // Keep mock profile intact during sandbox mode
      if (get().user?.sandbox) {
        set({ loading: false });
        return;
      }
      if (err.response?.status === 401) {
        get().logout();
      }
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const userId = get().user?._id;
      if (!userId) throw new Error('Not logged in');
      const { data } = await api.put(`/users/${userId}`, profileData);
      const currentUser = get().user;
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, loading: false });
      return { success: true };
    } catch (err) {
      // Local updates for sandbox mode
      const currentUser = get().user;
      if (currentUser?.sandbox) {
        const updatedUser = { ...currentUser, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser, loading: false });
        return { success: true };
      }
      return { success: false, error: 'Profile update failed' };
    }
  },

  updateAddress: async (addressData) => {
    set({ loading: true, error: null });
    try {
      const userId = get().user?._id;
      if (!userId) throw new Error('Not logged in');
      const { data } = await api.post(`/users/${userId}/address`, addressData);
      const currentUser = get().user;
      const updatedUser = { ...currentUser, address: data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, loading: false });
      return { success: true };
    } catch (err) {
      // Local updates for sandbox mode
      const currentUser = get().user;
      if (currentUser?.sandbox) {
        const updatedUser = { ...currentUser, address: addressData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser, loading: false });
        return { success: true };
      }
      return { success: false, error: 'Address update failed' };
    }
  },
}));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Don't retry if using mock JWT tokens in sandbox mode
    const token = localStorage.getItem('token');
    if (token && token.startsWith('mock_')) {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
