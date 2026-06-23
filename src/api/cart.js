import client from './client.js';

export const cartApi = {
  getCart: (subdomain) => client.get(`/api/cart/${subdomain}`),

  addToCart: (subdomain, slug, quantity) =>
    client.post('/api/cart/add', { subdomain, slug, quantity }),

  updateCartItem: (cartId, quantity) =>
    client.put(`/api/cart/update/${cartId}`, { quantity }),

  deleteCartItem: (cartId) => client.delete(`/api/cart/delete/${cartId}`),
};
