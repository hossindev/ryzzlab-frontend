import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useShop } from '../../context/ShopContext.jsx';

export const boldStyles = {
  page: {
    fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
  },
  container: { maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' },
  heading: { fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, textTransform: 'uppercase', marginBottom: '1rem' },
  accent: { color: '#ff3b00' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: '#222' },
  card: { background: '#0a0a0a', overflow: 'hidden', cursor: 'pointer', position: 'relative' },
  cardImg: { width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', filter: 'grayscale(20%)' },
  cardOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(to top, #000 0%, transparent 100%)',
    padding: '1.5rem 1rem 1rem',
  },
  cardName: { fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' },
  cardPrice: { color: '#ff3b00', fontWeight: 700, fontSize: '0.9rem' },
  btn: {
    background: '#ff3b00', color: '#fff', border: 'none',
    padding: '0.875rem 2rem', fontSize: '0.875rem', fontWeight: 900,
    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
    fontFamily: "'Arial Black', sans-serif",
  },
  btnOutline: {
    background: 'transparent', color: '#fff', border: '2px solid #fff',
    padding: '0.875rem 2rem', fontSize: '0.875rem', fontWeight: 900,
    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
    fontFamily: "'Arial Black', sans-serif",
  },
  input: {
    width: '100%', padding: '0.875rem 1rem',
    background: '#1a1a1a', border: '2px solid #333',
    color: '#fff', fontSize: '0.9rem',
    fontFamily: "'Arial Black', sans-serif",
    outline: 'none', boxSizing: 'border-box',
  },
  label: { display: 'block', fontSize: '0.7rem', fontWeight: 900, color: '#666', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
  formGroup: { marginBottom: '1.25rem' },
  error: { background: '#ff3b0020', border: '2px solid #ff3b00', color: '#ff3b00', padding: '0.875rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 700 },
  success: { background: '#00ff8820', border: '2px solid #00ff88', color: '#00ff88', padding: '0.875rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 700 },
};

export function BoldNav() {
  const { isCustomerLoggedIn, logoutCustomer } = useAuth();
  const { itemCount } = useCart();
  const { shop } = useShop();
  const nav = useNavigate();

  return (
    <nav style={{ background: '#000', borderBottom: '3px solid #ff3b00', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem' }}>
      <Link to="/" style={{ fontFamily: "'Arial Black', sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#fff', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
        {shop?.name || 'SHOP'}
      </Link>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Products</Link>
        {isCustomerLoggedIn ? (
          <>
            <Link to="/orders" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Orders</Link>
            <button onClick={logoutCustomer} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Arial Black', sans-serif" }}>Exit</button>
          </>
        ) : (
          <Link to="/login" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sign in</Link>
        )}
        <button onClick={() => nav('/cart')} style={boldStyles.btn}>Cart {itemCount > 0 && `(${itemCount})`}</button>
      </div>
    </nav>
  );
}
