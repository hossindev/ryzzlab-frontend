import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { productsApi } from '../../../api/products.js';
import { BoldNav, boldStyles as s } from '../components/Nav.jsx';
import Spinner from '../../../components/Spinner.jsx';

export function HomePage() {
  const { shop } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!shop) return;
    document.title = `${shop.name}`.toUpperCase();
    productsApi.getShopProducts(shop.subdomain)
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [shop]);

  return (
    <div style={s.page}>
      <BoldNav />
      {/* Hero */}
      <div style={{ position: 'relative', minHeight: 480, display: 'flex', alignItems: 'flex-end', padding: '3rem 2rem', overflow: 'hidden' }}>
        {shop?.bannerUrl && (
          <img src={shop.bannerUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.2em', color: '#ff3b00', textTransform: 'uppercase', marginBottom: '1rem' }}>New arrivals</div>
          <h1 style={s.heading}>{shop?.name}</h1>
          {shop?.tagline && <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: 500, marginTop: '1rem' }}>{shop.tagline}</p>}
        </div>
      </div>
      {/* Products */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 0 4rem' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #222' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.15em', color: '#666', textTransform: 'uppercase' }}>All products — {products.length} items</span>
        </div>
        {loading && <div style={{ padding: '2rem' }}><Spinner color="#ff3b00" /></div>}
        {error && <div style={{ ...s.error, margin: '2rem' }}>{error}</div>}
        <div style={s.grid}>
          {products.map((p) => (
            <div key={p.productId} style={s.card} onClick={() => nav(`/products/${p.slug}`)}>
              <img src={p.imageUrl || `https://placehold.co/400x400/111/444?text=${encodeURIComponent(p.name)}`} alt={p.name} style={s.cardImg} />
              <div style={s.cardOverlay}>
                <div style={s.cardName}>{p.name}</div>
                <div style={s.cardPrice}>€{parseFloat(p.price).toFixed(2)}</div>
                {p.stockQuantity === 0 && <div style={{ fontSize: '0.7rem', color: '#888', marginTop: 2 }}>SOLD OUT</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
