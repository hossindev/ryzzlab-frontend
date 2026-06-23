import client from './client.js';

export const addressApi = {
  getAllAddresses: (subdomain) => client.get(`/api/address/get/all/${subdomain}`),

  getAddress: (subdomain, addressId) =>
    client.get(`/api/address/get/${subdomain}?addressId=${addressId}`),

  createAddress: (subdomain, data) => client.post(`/api/address/${subdomain}`, data),
  // data: { street, city, postalCode, country, isDefault }

  updateAddress: (subdomain, data) => client.put(`/api/address/update/${subdomain}`, data),
  // data: { addressId, street, city, postalCode, country, isDefault }

  deleteAddress: (subdomain, addressId) =>
    client.delete(`/api/address/delete/${subdomain}?addressId=${addressId}`),
};
