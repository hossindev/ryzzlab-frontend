import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { useShop } from '../../../context/ShopContext.jsx';

const s = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 2rem',
    borderBottom: '1px solid #e5e7eb',
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 700,
    fontSize: '1.25rem',
    color: '#111',
    textDecoration: 'none',
    letterSpacing: '-0.03em',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '0.875rem',
    color: '#555',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
  cartBtn: {
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontFamily: "'Inter', system-ui, sans-serif",
    display: 'flex',
    gap: '0.4rem',
    alignItems: 'center',
  },
};

export function MinimalNav() {
  const { isCustomerLoggedIn, logoutCustomer } = useAuth();
  const { itemCount } = useCart();
  const { shop } = useShop();
  const nav = useNavigate();

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>
        {shop?.logoUrl ? (
          <img src={shop.logoUrl} alt={shop?.name} style={{ height: 32, objectFit: 'contain' }} />
        ) : (
          shop?.name || 'Shop'
        )}
      </Link>
      <div style={s.links}>
        <Link to="/" style={s.link}>Products</Link>
        {isCustomerLoggedIn ? (
          <>
            <Link to="/orders" style={s.link}>Orders</Link>
            <button
              onClick={logoutCustomer}
              style={{ ...s.link, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link to="/login" style={s.link}>Sign in</Link>
        )}
        <button style={s.cartBtn} onClick={() => nav('/cart')}>
          🛒 {itemCount > 0 && <span>{itemCount}</span>}
        </button>
      </div>
    </nav>
  );
}

export const minimalStyles = {
  page: {
    fontFamily: "'Inter', system-ui, sans-serif",
    minHeight: '100vh',
    background: '#fafafa',
    color: '#111',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    letterSpacing: '-0.04em',
    marginBottom: '0.5rem',
  },
  subheading: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '3rem',
    fontWeight: 400,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer',
  },
  cardImg: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    background: '#f3f4f6',
  },
  cardBody: { padding: '1rem' },
  cardName: { fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' },
  cardPrice: { color: '#555', fontSize: '0.875rem' },
  btn: {
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 600,
    transition: 'opacity 0.15s',
  },
  btnOutline: {
    background: 'transparent',
    color: '#111',
    border: '1.5px solid #111',
    borderRadius: '7px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1.5px solid #e5e7eb',
    borderRadius: '7px',
    fontSize: '0.9rem',
    fontFamily: "'Inter', system-ui, sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#444',
    marginBottom: '0.35rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  formGroup: { marginBottom: '1.25rem' },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: '7px',
    padding: '0.75rem 1rem',
    marginBottom: '1.25rem',
    fontSize: '0.875rem',
  },
  success: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#15803d',
    borderRadius: '7px',
    padding: '0.75rem 1rem',
    marginBottom: '1.25rem',
    fontSize: '0.875rem',
  },
};
