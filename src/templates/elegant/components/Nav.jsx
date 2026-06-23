import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useShop } from '../../context/ShopContext.jsx';

export const elegantStyles = {
  page: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    minHeight: '100vh',
    background: '#fdf8f3',
    color: '#1a1208',
  },
  container: { maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem' },
  heading: { fontFamily: "'Georgia', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, letterSpacing: '-0.02em', fontStyle: 'italic', marginBottom: '0.5rem' },
  subheading: { fontFamily: "'Georgia', serif", color: '#8a7a66', fontSize: '1rem', marginBottom: '3rem', fontStyle: 'italic' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2.5rem' },
  card: { cursor: 'pointer', background: '#fff', boxShadow: '0 2px 12px rgba(26,18,8,0.06)' },
  cardImg: { width: '100%', aspectRatio: '4/5', objectFit: 'cover', background: '#f0ebe3', display: 'block' },
  cardBody: { padding: '1.25rem' },
  cardName: { fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: '1rem', marginBottom: '0.3rem', fontStyle: 'italic' },
  cardPrice: { color: '#8a7a66', fontSize: '0.875rem', letterSpacing: '0.05em' },
  btn: {
    background: '#1a1208', color: '#fdf8f3', border: 'none',
    padding: '0.875rem 2.5rem', fontSize: '0.8rem', fontFamily: "'Georgia', serif",
    letterSpacing: '0.12em', cursor: 'pointer', fontStyle: 'italic',
  },
  btnOutline: {
    background: 'transparent', color: '#1a1208', border: '1px solid #1a1208',
    padding: '0.875rem 2.5rem', fontSize: '0.8rem', fontFamily: "'Georgia', serif",
    letterSpacing: '0.12em', cursor: 'pointer',
  },
  input: {
    width: '100%', padding: '0.875rem 1rem',
    border: 'none', borderBottom: '1px solid #c5b89a',
    background: 'transparent', fontSize: '0.9rem',
    fontFamily: "'Georgia', serif", outline: 'none',
    boxSizing: 'border-box', color: '#1a1208',
  },
  label: { display: 'block', fontSize: '0.7rem', color: '#8a7a66', marginBottom: '0.35rem', letterSpacing: '0.12em', textTransform: 'uppercase' },
  formGroup: { marginBottom: '1.5rem' },
  error: { background: '#fff5f5', borderLeft: '3px solid #c0392b', color: '#c0392b', padding: '0.875rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontStyle: 'italic' },
  success: { background: '#f0faf5', borderLeft: '3px solid #27ae60', color: '#27ae60', padding: '0.875rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontStyle: 'italic' },
};

export function ElegantNav() {
  const { isCustomerLoggedIn, logoutCustomer } = useAuth();
  const { itemCount } = useCart();
  const { shop } = useShop();
  const nav = useNavigate();

  return (
    <>
      <div style={{ background: '#1a1208', color: '#c5b89a', textAlign: 'center', padding: '0.5rem', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        {shop?.tagline || 'Free shipping on orders over €100'}
      </div>
      <nav style={{ background: '#fdf8f3', borderBottom: '1px solid #e5ddd0', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '1.5rem', color: '#1a1208', textDecoration: 'none', letterSpacing: '0.05em' }}>
          {shop?.name || 'The Shop'}
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#6b5d4f', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Collection</Link>
          {isCustomerLoggedIn ? (
            <>
              <Link to="/orders" style={{ color: '#6b5d4f', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Orders</Link>
              <button onClick={logoutCustomer} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b5d4f', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Georgia', serif" }}>Leave</button>
            </>
          ) : (
            <Link to="/login" style={{ color: '#6b5d4f', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Sign in</Link>
          )}
          <button onClick={() => nav('/cart')} style={{ background: 'none', border: '1px solid #c5b89a', padding: '0.5rem 1rem', fontSize: '0.7rem', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: "'Georgia', serif", color: '#1a1208' }}>
            Bag {itemCount > 0 && `(${itemCount})`}
          </button>
        </div>
      </nav>
    </>
  );
}
