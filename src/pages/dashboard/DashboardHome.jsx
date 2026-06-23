import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { shopApi } from '../../api/shop.js';
import DashboardLayout from './DashboardLayout.jsx';
import { ds } from './styles.js';
import Spinner from '../../components/Spinner.jsx';

export default function DashboardHome() {
  const { ownerToken } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  // We don't have a "list my shops" endpoint, so we surface quick-action cards
  useEffect(() => {
    document.title = 'Dashboard — ryzzlab';
  }, []);

  return (
    <DashboardLayout>
      <h1 style={ds.heading}>Dashboard</h1>
      <p style={ds.sub}>Welcome to ryzzlab. Manage your shop from here.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Create a shop', to: '/shop/create', icon: '🏪' },
          { label: 'Customise shop', to: '/shop/customize', icon: '🎨' },
          { label: 'Add a product', to: '/products/create', icon: '📦' },
          { label: 'View orders', to: '/orders', icon: '📋' },
        ].map(({ label, to, icon }) => (
          <Link
            key={to}
            to={to}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              gap: '0.75rem', padding: '1.5rem', background: '#fff',
              border: '1px solid #e9ecef', borderRadius: '10px', textDecoration: 'none',
              color: '#111', transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px #6366f115'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <span style={{ fontSize: '1.75rem' }}>{icon}</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
          </Link>
        ))}
      </div>

      <div style={ds.card}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>
          <strong style={{ color: '#111' }}>Getting started</strong><br />
          1. Create a shop and choose a template.<br />
          2. Customise your branding (logo, colours, banner).<br />
          3. Add products.<br />
          4. Share your storefront URL with customers.
        </p>
      </div>
    </DashboardLayout>
  );
}
