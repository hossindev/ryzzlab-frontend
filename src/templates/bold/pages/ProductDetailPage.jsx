import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { productsApi } from '../../../api/products.js';
import { BoldNav, boldStyles as s } from '../components/Nav.jsx';
import Spinner from '../../../components/Spinner.jsx';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { shop } = useShop();
  const { addToCart } = useCart();
  const { isCustomerLoggedIn } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    if (!shop) return;
    productsApi.getProduct(shop.subdomain, slug)
      .then((res) => { setProduct(res.data); document.title = res.data.name.toUpperCase(); })
      .catch((err) => setError(err.response?.status === 404 ? 'Product not found.' : err.message))
      .finally(() => setLoading(false));
  }, [shop, slug]);

  const handleAdd = async () => {
    if (!isCustomerLoggedIn) { nav('/login'); return; }
    setAdding(true);
    try { await addToCart(product.slug, qty); setMsg('Added!'); setTimeout(() => setMsg(''), 2000); }
    catch (err) { setMsg(err.response?.data || 'Error'); }
    finally { setAdding(false); }
  };

  return (
    <div style={s.page}>
      <BoldNav />
      <div style={s.container}>
        <button onClick={() => nav(-1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem', fontFamily: "'Arial Black', sans-serif" }}>← BACK</button>
        {loading && <Spinner color="#ff3b00" />}
        {error && <div style={s.error}>{error}</div>}
        {product && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            <img src={product.imageUrl || `https://placehold.co/600x600/111/333?text=${encodeURIComponent(product.name)}`} alt={product.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', filter: 'grayscale(10%)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Product</div>
              <h1 style={{ ...s.heading, fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>{product.name}</h1>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ff3b00', marginBottom: '1.5rem' }}>€{parseFloat(product.price).toFixed(2)}</div>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.9rem' }}>{product.description}</p>
              {product.stockQuantity > 0 ? (
                <>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ ...s.btnOutline, padding: '0.5rem 1rem' }}>−</button>
                    <span style={{ fontWeight: 900, fontSize: '1.25rem' }}>{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))} style={{ ...s.btnOutline, padding: '0.5rem 1rem' }}>+</button>
                    <span style={{ color: '#555', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>{product.stockQuantity} left</span>
                  </div>
                  <button style={{ ...s.btn, fontSize: '1rem', padding: '1rem 3rem' }} onClick={handleAdd} disabled={adding}>
                    {adding ? '...' : 'ADD TO CART'}
                  </button>
                  {msg && <div style={{ ...s.success, marginTop: '1rem' }}>{msg}</div>}
                </>
              ) : (
                <div style={{ color: '#ff3b00', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sold out</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
