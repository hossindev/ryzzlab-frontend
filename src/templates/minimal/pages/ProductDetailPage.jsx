import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { productsApi } from '../../../api/products.js';
import { MinimalNav, minimalStyles as s } from '../components/Nav.jsx';
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
  const [addMsg, setAddMsg] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    if (!shop) return;
    productsApi
      .getProduct(shop.subdomain, slug)
      .then((res) => {
        setProduct(res.data);
        document.title = `${res.data.name} — ${shop.name}`;
      })
      .catch((err) => setError(err.response?.status === 404 ? 'Product not found.' : err.message))
      .finally(() => setLoading(false));
  }, [shop, slug]);

  const handleAdd = async () => {
    if (!isCustomerLoggedIn) {
      nav('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.slug, qty);
      setAddMsg('Added to cart!');
      setTimeout(() => setAddMsg(''), 2500);
    } catch (err) {
      setAddMsg(err.response?.data || 'Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={s.page}>
      <MinimalNav />
      <div style={s.container}>
        <button
          onClick={() => nav(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', marginBottom: '1.5rem', fontSize: '0.875rem' }}
        >
          ← Back
        </button>
        {loading && <Spinner />}
        {error && <div style={s.error}>{error}</div>}
        {product && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            <img
              src={product.imageUrl || `https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '12px', background: '#f3f4f6' }}
            />
            <div>
              <h1 style={{ ...s.heading, fontSize: '1.75rem' }}>{product.name}</h1>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111' }}>
                €{parseFloat(product.price).toFixed(2)}
              </div>
              <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '2rem' }}>{product.description}</p>
              {product.stockQuantity > 0 ? (
                <>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <label style={s.label}>Qty</label>
                    <input
                      type="number"
                      min={1}
                      max={product.stockQuantity}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ ...s.input, width: 80 }}
                    />
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>{product.stockQuantity} available</span>
                  </div>
                  <button style={s.btn} onClick={handleAdd} disabled={adding}>
                    {adding ? 'Adding…' : 'Add to cart'}
                  </button>
                </>
              ) : (
                <div style={{ color: '#ef4444', fontWeight: 600 }}>Out of stock</div>
              )}
              {addMsg && <div style={{ ...s.success, marginTop: '1rem' }}>{addMsg}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
