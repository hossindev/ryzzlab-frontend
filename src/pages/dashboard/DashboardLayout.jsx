import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/',                  label: 'Overview',        icon: '▦' },
  { to: '/shop/create',       label: 'Create shop',     icon: '+' },
  { to: '/shop/customize',    label: 'Customise',       icon: '✎' },
  { to: '/products',          label: 'Products',        icon: '◫' },
  { to: '/products/create',   label: 'Add product',     icon: '＋' },
  { to: '/orders',            label: 'Orders',          icon: '◳' },
];

const s = {
  shell: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: '#f8f9fa' },
  sidebar: { width: 220, background: '#fff', borderRight: '1px solid #e9ecef', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', flexShrink: 0 },
  brand: { fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em', color: '#111', padding: '0 1.5rem', marginBottom: '2rem', display: 'block', textDecoration: 'none' },
  navItem: (active) => ({
    display: 'flex', gap: '0.6rem', alignItems: 'center',
    padding: '0.6rem 1.5rem', fontSize: '0.875rem', fontWeight: active ? 600 : 400,
    color: active ? '#111' : '#6b7280', background: active ? '#f3f4f6' : 'transparent',
    textDecoration: 'none', borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
    transition: 'all 0.1s',
  }),
  main: { flex: 1, padding: '2.5rem', overflowY: 'auto' },
  logoutBtn: { marginTop: 'auto', padding: '0.6rem 1.5rem', fontSize: '0.875rem', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' },
};

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const { logoutOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logoutOwner(); navigate('/login'); };

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <Link to="/" style={s.brand}>ryzzlab ↗</Link>
        <nav>
          {NAV_ITEMS.map(({ to, label, icon }) => {
            const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <Link key={to} to={to} style={s.navItem(active)}>
                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
        <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
      </aside>
      <main style={s.main}>{children}</main>
    </div>
  );
}
