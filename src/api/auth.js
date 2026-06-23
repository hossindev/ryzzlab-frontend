import client from './client.js';

export const authApi = {
  // Owner auth
  registerOwner: (email, password, fullName) =>
    client.post('/api/auth/owner/register', { email, password, fullName }),

  loginOwner: (email, password) =>
    client.post('/api/auth/owner/login', { email, password }),

  // Customer auth (shop-scoped)
  registerCustomer: (email, password, fullName, subdomain) =>
    client.post('/api/auth/customer/register', { email, password, fullName, subdomain }),

  loginCustomer: (email, password, subdomain) =>
    client.post('/api/auth/customer/login', { email, password, subdomain }),
};
