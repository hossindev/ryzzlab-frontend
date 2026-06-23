import client from './client.js';

export const productsApi = {
  getShopProducts: (subdomain) => client.get(`/api/products/shop/${subdomain}`),

  getProduct: (subdomain, slug) => client.get(`/api/products/${subdomain}/${slug}`),

  createProduct: (data) => client.post('/api/products/create', data),
  // data: { shopId, name, description, imageUrl, price, stockQuantity }

  updateProduct: (productId, data) => client.put(`/api/products/${productId}`, data),
  // data: { name?, description?, imageUrl?, price?, stockQuantity? }

  deleteProduct: (productId) => client.delete(`/api/products/${productId}`),
};
