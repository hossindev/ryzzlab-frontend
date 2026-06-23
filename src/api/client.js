import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.ryzzlab.xyz';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the correct Bearer token on every request
client.interceptors.request.use((config) => {
  // Determine which token to use based on the URL
  const isOwnerEndpoint =
    config.url?.includes('/api/auth/owner') ||
    config.url?.includes('/api/shops') ||
    (config.url?.includes('/api/products') && config.method !== 'get') ||
    config.url?.includes('/api/orders/shop') ||
    (config.url?.includes('/api/orders/') && config.url?.includes('/status'));

  if (isOwnerEndpoint) {
    const token = localStorage.getItem('owner_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Customer token is shop-scoped
    const subdomain = getStorefrontSubdomain();
    if (subdomain) {
      const token = localStorage.getItem(`token_${subdomain}`);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global 401 handler
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const subdomain = getStorefrontSubdomain();
      if (subdomain) {
        localStorage.removeItem(`token_${subdomain}`);
        window.dispatchEvent(new CustomEvent('auth:customer:logout'));
      } else {
        localStorage.removeItem('owner_token');
        window.dispatchEvent(new CustomEvent('auth:owner:logout'));
      }
    }
    return Promise.reject(error);
  }
);

function getStorefrontSubdomain() {
  if (import.meta.env.VITE_DEV_SUBDOMAIN) return import.meta.env.VITE_DEV_SUBDOMAIN;
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null;
  const parts = hostname.split('.');
  if (parts.length <= 2 || parts[0] === 'www' || parts[0] === 'dashboard') return null;
  return parts[0];
}

export default client;
