import client from './client.js';

export const ordersApi = {
  checkout: (subdomain, addressId) =>
    client.post(`/api/orders/checkout/${subdomain}?addressId=${addressId}`),

  getOrderHistory: (subdomain) => client.get(`/api/orders/${subdomain}`),

  getShopOrders: (subdomain) => client.get(`/api/orders/shop/${subdomain}`),

  updateOrderStatus: (orderId, newStatus) =>
    client.put(`/api/orders/${orderId}/status`, { newStatus }),
};
