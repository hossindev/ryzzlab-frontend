import { createContext, useContext, useState, useCallback } from 'react';
import { cartApi } from '../api/cart.js';

const CartContext = createContext(null);

export function CartProvider({ children, subdomain }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!subdomain) return;
    setLoading(true);
    setError(null);
    try {
      const res = await cartApi.getCart(subdomain);
      setItems(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  const addToCart = useCallback(
    async (slug, quantity = 1) => {
      const res = await cartApi.addToCart(subdomain, slug, quantity);
      await fetchCart();
      return res.data;
    },
    [subdomain, fetchCart]
  );

  const updateItem = useCallback(
    async (cartId, quantity) => {
      if (quantity <= 0) {
        await cartApi.deleteCartItem(cartId);
      } else {
        await cartApi.updateCartItem(cartId, quantity);
      }
      await fetchCart();
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (cartId) => {
      await cartApi.deleteCartItem(cartId);
      await fetchCart();
    },
    [fetchCart]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, item) => sum + parseFloat(item.lineTotal || 0), 0);
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        error,
        total,
        itemCount,
        fetchCart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
