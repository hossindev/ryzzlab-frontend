import client from './client.js';

export const shopApi = {
  getShop: (subdomain) => client.get(`/api/shops/${subdomain}`),

  createShop: (data) => client.post('/api/shops/create', data),
  // data: { name, subdomain, description, templateName }

  updateCustomization: (data) => client.put('/api/shops/customization', data),
  // data: { shopId, logoUrl, bannerUrl, tagline, primaryColor, secondaryColor, font }
};
