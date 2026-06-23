import { createContext, useContext, useState, useEffect } from 'react';
import { shopApi } from '../api/shop.js';

const ShopContext = createContext(null);

export function ShopProvider({ children, subdomain }) {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!subdomain) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setNotFound(false);

    shopApi
      .getShop(subdomain)
      .then((res) => {
        setShop(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.message || 'Failed to load shop');
        }
      })
      .finally(() => setLoading(false));
  }, [subdomain]);

  return (
    <ShopContext.Provider value={{ shop, loading, error, notFound, setShop }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
