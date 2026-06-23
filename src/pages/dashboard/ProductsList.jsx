import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products.js';
import DashboardLayout from './DashboardLayout.jsx';
import { ds } from './styles.js';
import Spinner from '../../components/Spinner.jsx';

export default function ProductsList() {
  const [subdomain, setSubdomain] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');

  const fetchProducts = async () => {
    if (!subdomain.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await productsApi.getShopProducts(subdomain.trim());
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await productsApi.deleteProduct(productId);
      setDeleteMsg(`"${name}" deleted.`);
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
      setTimeout(() => setDeleteMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data || 'Failed to delete product.');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
        <h1 style={ds.heading}>Products</h1>
        <Link to="/products/create" style={{ ...ds.btn, textDecoration: 'none' }}>+ Add product</Link>
      </div>
      <p style={ds.sub}>Enter your shop subdomain to load and manage products.</p>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input
          style={{ ...ds.input, maxWidth: 280 }}
          placeholder="your-subdomain"
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
        />
        <button style={ds.btn} onClick={fetchProducts} disabled={loading}>Load products</button>
      </div>

      {error && <div style={ds.error}>{error}</div>}
      {deleteMsg && <div style={ds.success}>{deleteMsg}</div>}
      {loading && <Spinner />}

      {!loading && products.length > 0 && (
        <div style={ds.card}>
          <table style={ds.table}>
            <thead>
              <tr>
                <th style={ds.th}>Product</th>
                <th style={ds.th}>Price</th>
                <th style={ds.th}>Stock</th>
                <th style={ds.th}>Slug</th>
                <th style={ds.th}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.productId}>
                  <td style={ds.td}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img
                        src={p.imageUrl || `https://placehold.co/40x40`}
                        alt={p.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, background: '#f3f4f6' }}
                      />
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={ds.td}>€{parseFloat(p.price).toFixed(2)}</td>
                  <td style={ds.td}>
                    <span style={ds.badge(p.stockQuantity > 0 ? '#10b981' : '#ef4444')}>
                      {p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td style={{ ...ds.td, color: '#9ca3af', fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.slug}</td>
                  <td style={{ ...ds.td, display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/products/${p.productId}/edit`} style={{ ...ds.btnOutline, fontSize: '0.8rem', padding: '0.35rem 0.75rem', textDecoration: 'none' }}>
                      Edit
                    </Link>
                    <button style={ds.btnDanger} onClick={() => handleDelete(p.productId, p.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && products.length === 0 && subdomain && !error && (
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No products found for this subdomain.</p>
      )}
    </DashboardLayout>
  );
}
