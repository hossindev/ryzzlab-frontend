import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useShop } from '../../../context/ShopContext.jsx';
import { MinimalNav, minimalStyles as s } from '../components/Nav.jsx';
import Spinner from '../../../components/Spinner.jsx';

export default function CartPage() {
  const { items, loading, error, total, fetchCart, updateItem, removeItem } = useCart();
  const { isCustomerLoggedIn } = useAuth();
  const { shop } = useShop();
  const nav = useNavigate();

  useEffect(() => {
    if (shop) {
      document.title = `Cart — ${shop.name}`;
      if (isCustomerLoggedIn) fetchCart();
    }
  }, [shop, isCustomerLoggedIn]);

  if (!isCustomerLoggedIn) {
    return (
      <div style={s.page}>
        <MinimalNav />
        <div style={{ ...s.container, textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Sign in to view your cart.</p>
          <Link to="/login" style={{ ...s.btn, textDecoration: 'none', display: 'inline-block' }}>
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <MinimalNav />
      <div style={s.container}>
        <h1 style={s.heading}>Your cart</h1>
        {loading && <Spinner />}
        {error && <div style={s.error}>{error}</div>}
        {!loading && items.length === 0 && (
          <div style={{ color: '#999' }}>
            Your cart is empty.{' '}
            <Link to="/" style={{ color: '#111', textDecoration: 'underline' }}>
              Keep shopping
            </Link>
          </div>
        )}
        {items.length > 0 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {items.map((item) => (
                <div
                  key={item.cartId}
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: '10px',
                    padding: '1rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  <img
                    src={item.imageUrl || `https://placehold.co/80x80?text=${encodeURIComponent(item.productName)}`}
                    alt={item.productName}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, background: '#f3f4f6' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ color: '#666', fontSize: '0.875rem' }}>€{parseFloat(item.unitPrice).toFixed(2)} each</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => updateItem(item.cartId, item.quantity - 1)}
                      style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '1rem' }}
                    >−</button>
                    <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateItem(item.cartId, item.quantity + 1)}
                      style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '1rem' }}
                    >+</button>
                  </div>
                  <div style={{ fontWeight: 600, minWidth: 70, textAlign: 'right' }}>
                    €{parseFloat(item.lineTotal).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.cartId)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1.2rem' }}
                  >×</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total: €{total.toFixed(2)}</div>
              <button style={s.btn} onClick={() => nav('/checkout')}>Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
