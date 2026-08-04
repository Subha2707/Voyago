import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Server-side Google OAuth entry point. On Netlify set VITE_API_URL to your
// Render backend (https://<app>.onrender.com/api) so this resolves correctly.
export const GOOGLE_AUTH_URL = `${API_BASE.replace(/\/$/, '')}/auth/google`;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Request interceptor: add access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: refresh token on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        useAuthStore.getState().setAuth({
          user: useAuthStore.getState().user,
          accessToken: newAccessToken,
        });

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        // Redirect to login if path is not public
        if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
