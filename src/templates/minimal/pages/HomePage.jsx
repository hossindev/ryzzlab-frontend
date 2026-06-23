import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext.jsx';
import { productsApi } from '../../../api/products.js';
import { MinimalNav, minimalStyles as s } from '../components/Nav.jsx';
import Spinner from '../../../components/Spinner.jsx';

export default function HomePage() {
  const { shop } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!shop) return;
    document.title = `${shop.name} — Products`;
    productsApi
      .getShopProducts(shop.subdomain)
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [shop]);

  return (
    <div style={s.page}>
      <MinimalNav />
      {shop?.bannerUrl && (
        <img
          src={shop.bannerUrl}
          alt=""
          style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
        />
      )}
      <div style={s.container}>
        <h1 style={s.heading}>{shop?.name}</h1>
        <p style={s.subheading}>{shop?.tagline || shop?.description}</p>

        {loading && <Spinner />}
        {error && (
          <div style={s.error}>
            Failed to load products. <button onClick={() => window.location.reload()} style={{ marginLeft: 8, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Retry</button>
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <p style={{ color: '#999' }}>No products yet.</p>
        )}
        <div style={s.grid}>
          {products.map((p) => (
            <div
              key={p.productId}
              style={s.card}
              onClick={() => nav(`/products/${p.slug}`)}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
            >
              <img
                src={p.imageUrl || `https://placehold.co/400x400?text=${encodeURIComponent(p.name)}`}
                alt={p.name}
                style={s.cardImg}
              />
              <div style={s.cardBody}>
                <div style={s.cardName}>{p.name}</div>
                <div style={s.cardPrice}>€{parseFloat(p.price).toFixed(2)}</div>
                {p.stockQuantity === 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>Out of stock</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
