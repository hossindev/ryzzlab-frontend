import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { productsApi } from '../../../api/products.js';
import { addressApi } from '../../../api/address.js';
import { ordersApi } from '../../../api/orders.js';
import { ElegantNav, elegantStyles as s } from '../components/Nav.jsx';
import Spinner from '../../../components/Spinner.jsx';

export function HomePage() {
  const { shop } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (!shop) return;
    document.title = `${shop.name}`;
    productsApi.getShopProducts(shop.subdomain).then(r => setProducts(r.data)).finally(() => setLoading(false));
  }, [shop]);

  return (
    <div style={s.page}>
      <ElegantNav />
      {shop?.bannerUrl && (
        <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
          <img src={shop.bannerUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,8,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ ...s.heading, color: '#fdf8f3', fontSize: 'clamp(2.5rem, 5vw, 5rem)', textAlign: 'center' }}>{shop.name}</h1>
          </div>
        </div>
      )}
      <div style={s.container}>
        {!shop?.bannerUrl && <h1 style={s.heading}>{shop?.name}</h1>}
        <p style={s.subheading}>{shop?.description}</p>
        <div style={{ height: 1, background: '#e5ddd0', marginBottom: '3rem' }} />
        {loading && <Spinner color="#8a7a66" />}
        <div style={s.grid}>
          {products.map(p => (
            <div key={p.productId} style={s.card} onClick={() => nav(`/products/${p.slug}`)}>
              <img src={p.imageUrl || `https://placehold.co/400x500/f0ebe3/8a7a66?text=${encodeURIComponent(p.name)}`} alt={p.name} style={s.cardImg} />
              <div style={s.cardBody}>
                <div style={s.cardName}>{p.name}</div>
                <div style={s.cardPrice}>€ {parseFloat(p.price).toFixed(2)}</div>
                {p.stockQuantity === 0 && <div style={{ fontSize: '0.7rem', color: '#c0392b', marginTop: 4, fontStyle: 'italic' }}>Unavailable</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer style={{ borderTop: '1px solid #e5ddd0', padding: '2rem', textAlign: 'center', color: '#8a7a66', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        © {new Date().getFullYear()} {shop?.name}
      </footer>
    </div>
  );
}

export function ProductDetailPage() {
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
    productsApi.getProduct(shop.subdomain, slug).then(r => { setProduct(r.data); document.title = r.data.name; }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [shop, slug]);

  const handleAdd = async () => {
    if (!isCustomerLoggedIn) { nav('/login'); return; }
    setAdding(true);
    try { await addToCart(product.slug, qty); setMsg('Added to your bag.'); setTimeout(() => setMsg(''), 2500); }
    catch (err) { setMsg(err.response?.data || 'Error.'); }
    finally { setAdding(false); }
  };

  return (
    <div style={s.page}><ElegantNav />
      <div style={s.container}>
        <button onClick={() => nav(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a7a66', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2rem', fontFamily: "'Georgia', serif" }}>← Collection</button>
        {loading && <Spinner color="#8a7a66" />}
        {error && <div style={s.error}>{error}</div>}
        {product && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
            <img src={product.imageUrl || `https://placehold.co/600x700/f0ebe3/8a7a66?text=${encodeURIComponent(product.name)}`} alt={product.name} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} />
            <div>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a7a66', marginBottom: '1rem' }}>{shop?.name}</p>
              <h1 style={s.heading}>{product.name}</h1>
              <div style={{ fontSize: '1.25rem', color: '#8a7a66', marginBottom: '2rem', letterSpacing: '0.05em' }}>€ {parseFloat(product.price).toFixed(2)}</div>
              <p style={{ color: '#6b5d4f', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '0.9rem' }}>{product.description}</p>
              {product.stockQuantity > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <label style={s.label}>Quantity</label>
                    <select value={qty} onChange={e => setQty(Number(e.target.value))} style={{ padding: '0.5rem', border: '1px solid #c5b89a', background: 'transparent', fontFamily: "'Georgia', serif", fontSize: '0.9rem' }}>
                      {Array.from({ length: Math.min(product.stockQuantity, 10) }, (_, i) => i + 1).map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <button style={s.btn} onClick={handleAdd} disabled={adding}>{adding ? 'Adding…' : 'Add to bag'}</button>
                  {msg && <div style={{ ...s.success, marginTop: '1rem' }}>{msg}</div>}
                </>
              ) : (
                <div style={{ color: '#c0392b', fontStyle: 'italic', fontSize: '0.9rem' }}>Currently unavailable</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CartPage() {
  const { items, loading, total, fetchCart, updateItem, removeItem } = useCart();
  const { isCustomerLoggedIn } = useAuth();
  const { shop } = useShop();
  const nav = useNavigate();

  useEffect(() => {
    if (shop) { document.title = `Bag — ${shop.name}`; if (isCustomerLoggedIn) fetchCart(); }
  }, [shop, isCustomerLoggedIn]);

  if (!isCustomerLoggedIn) return (
    <div style={s.page}><ElegantNav />
      <div style={{ ...s.container, textAlign: 'center' }}>
        <p style={{ color: '#8a7a66', fontStyle: 'italic', marginBottom: '2rem' }}>Sign in to view your bag.</p>
        <Link to="/login" style={{ ...s.btn, textDecoration: 'none', display: 'inline-block' }}>Sign in</Link>
      </div>
    </div>
  );

  return (
    <div style={s.page}><ElegantNav />
      <div style={s.container}>
        <h1 style={{ ...s.heading, marginBottom: '2rem' }}>Your bag</h1>
        <div style={{ height: 1, background: '#e5ddd0', marginBottom: '2rem' }} />
        {loading && <Spinner color="#8a7a66" />}
        {!loading && items.length === 0 && <p style={{ color: '#8a7a66', fontStyle: 'italic' }}>Your bag is empty. <Link to="/" style={{ color: '#1a1208' }}>Continue shopping</Link></p>}
        {items.map(item => (
          <div key={item.cartId} style={{ display: 'flex', gap: '2rem', alignItems: 'center', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5ddd0' }}>
            <img src={item.imageUrl || `https://placehold.co/80x100/f0ebe3/8a7a66`} alt={item.productName} style={{ width: 80, height: 100, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontStyle: 'italic', marginBottom: '0.25rem' }}>{item.productName}</div>
              <div style={{ color: '#8a7a66', fontSize: '0.875rem' }}>€ {parseFloat(item.unitPrice).toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => updateItem(item.cartId, item.quantity - 1)} style={{ width: 28, height: 28, border: '1px solid #c5b89a', background: 'transparent', cursor: 'pointer' }}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateItem(item.cartId, item.quantity + 1)} style={{ width: 28, height: 28, border: '1px solid #c5b89a', background: 'transparent', cursor: 'pointer' }}>+</button>
            </div>
            <div style={{ color: '#1a1208', minWidth: 80, textAlign: 'right' }}>€ {parseFloat(item.lineTotal).toFixed(2)}</div>
            <button onClick={() => removeItem(item.cartId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c5b89a', fontSize: '1.25rem' }}>×</button>
          </div>
        ))}
        {items.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3rem', marginTop: '1rem' }}>
            <div style={{ fontStyle: 'italic', color: '#6b5d4f' }}>Total — <strong>€ {total.toFixed(2)}</strong></div>
            <button style={s.btn} onClick={() => nav('/checkout')}>Proceed to checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { shop } = useShop();
  const { items, total, fetchCart, clearCart } = useCart();
  const nav = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ street: '', city: '', postalCode: '', country: '', isDefault: false });

  useEffect(() => {
    if (!shop) return;
    document.title = `Checkout — ${shop.name}`;
    fetchCart();
    addressApi.getAllAddresses(shop.subdomain).then(r => { setAddresses(r.data); const def = r.data.find(a => a.isDefault); if (def) setSelectedAddress(def.addressId); else if (r.data.length > 0) setSelectedAddress(r.data[0].addressId); }).catch(() => {}).finally(() => setLoadingAddr(false));
  }, [shop]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try { const r = await addressApi.createAddress(shop.subdomain, form); const u = await addressApi.getAllAddresses(shop.subdomain); setAddresses(u.data); setSelectedAddress(r.data.addressId); setShowForm(false); }
    catch { setError('Failed to save address.'); }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) { setError('Please select an address.'); return; }
    setPlacing(true); setError('');
    try { await ordersApi.checkout(shop.subdomain, selectedAddress); clearCart(); setSuccess('Order placed successfully.'); setTimeout(() => nav('/orders'), 2000); }
    catch (err) { setError(err.response?.data || 'Checkout failed.'); }
    finally { setPlacing(false); }
  };

  return (
    <div style={s.page}><ElegantNav />
      <div style={s.container}>
        <h1 style={{ ...s.heading, marginBottom: '2rem' }}>Checkout</h1>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '4rem' }}>
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a7a66', marginBottom: '1rem' }}>Delivery address</p>
            {loadingAddr ? <Spinner color="#8a7a66" /> : (
              <>
                {addresses.map(addr => (
                  <label key={addr.addressId} style={{ display: 'flex', gap: '0.75rem', padding: '1rem', border: `1px solid ${selectedAddress === addr.addressId ? '#1a1208' : '#e5ddd0'}`, marginBottom: '0.75rem', cursor: 'pointer' }}>
                    <input type="radio" name="addr" value={addr.addressId} checked={selectedAddress === addr.addressId} onChange={() => setSelectedAddress(addr.addressId)} />
                    <div><div style={{ fontStyle: 'italic' }}>{addr.street}</div><div style={{ color: '#8a7a66', fontSize: '0.875rem' }}>{addr.city}, {addr.postalCode}, {addr.country}</div></div>
                  </label>
                ))}
                <button onClick={() => setShowForm(!showForm)} style={{ ...s.btnOutline, fontSize: '0.75rem', padding: '0.5rem 1.5rem', marginTop: '0.5rem' }}>+ Add address</button>
                {showForm && (
                  <form onSubmit={handleAddAddress} style={{ marginTop: '1.5rem' }}>
                    {[['street','Street'],['city','City'],['postalCode','Postal code'],['country','Country']].map(([f,l]) => (
                      <div style={s.formGroup} key={f}><label style={s.label}>{l}</label><input required style={s.input} value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} /></div>
                    ))}
                    <button type="submit" style={s.btn}>Save address</button>
                  </form>
                )}
              </>
            )}
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a7a66', marginBottom: '1rem' }}>Order summary</p>
            {items.map(item => (
              <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ fontStyle: 'italic' }}>{item.productName} × {item.quantity}</span>
                <span>€ {parseFloat(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #e5ddd0', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontStyle: 'italic' }}>Total</span><span>€ {total.toFixed(2)}</span>
            </div>
            <button style={{ ...s.btn, width: '100%', marginTop: '2rem' }} onClick={handleCheckout} disabled={placing}>{placing ? 'Placing order…' : 'Place order'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SC = { PENDING: '#b7791f', PAID: '#2b6cb0', SHIPPED: '#553c9a', DELIVERED: '#276749', CANCELED: '#c0392b' };

export function OrderHistoryPage() {
  const { shop } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) return;
    document.title = `Orders — ${shop.name}`;
    ordersApi.getOrderHistory(shop.subdomain).then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, [shop]);

  return (
    <div style={s.page}><ElegantNav />
      <div style={s.container}>
        <h1 style={{ ...s.heading, marginBottom: '2rem' }}>Your orders</h1>
        <div style={{ height: 1, background: '#e5ddd0', marginBottom: '2rem' }} />
        {loading && <Spinner color="#8a7a66" />}
        {!loading && orders.length === 0 && <p style={{ color: '#8a7a66', fontStyle: 'italic' }}>No orders yet.</p>}
        {orders.map(order => (
          <div key={order.orderId} style={{ borderBottom: '1px solid #e5ddd0', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div><div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Order #{order.orderId.slice(0,8).toUpperCase()}</div><div style={{ color: '#8a7a66', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
              <span style={{ color: SC[order.status], fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontStyle: 'italic' }}>{order.status}</span>
            </div>
            {order.orderItems?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b5d4f', marginBottom: '0.25rem' }}>
                <span style={{ fontStyle: 'italic' }}>{item.productName} × {item.quantity}</span>
                <span>€ {parseFloat(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', fontSize: '0.875rem', color: '#1a1208' }}>
              Total — <strong style={{ marginLeft: '0.5rem' }}>€ {parseFloat(order.totalPrice).toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoginPage() {
  const { loginCustomer } = useAuth();
  const { shop } = useShop();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await loginCustomer(email, password); nav('/'); }
    catch (err) { setError(err.response?.data || 'Invalid credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}><ElegantNav />
      <div style={{ ...s.container, maxWidth: 420 }}>
        <h1 style={{ ...s.heading, marginBottom: '0.25rem' }}>Sign in</h1>
        <p style={s.subheading}>to your {shop?.name} account</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.formGroup}><label style={s.label}>Email</label><input type="email" required style={s.input} value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div style={s.formGroup}><label style={s.label}>Password</label><input type="password" required style={s.input} value={password} onChange={e => setPassword(e.target.value)} /></div>
          <button type="submit" style={{ ...s.btn, width: '100%', marginTop: '1rem' }} disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#8a7a66', letterSpacing: '0.05em' }}>
          New customer? <Link to="/register" style={{ color: '#1a1208' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { registerCustomer } = useAuth();
  const { shop } = useShop();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await registerCustomer(form.email, form.password, form.fullName); nav('/'); }
    catch (err) { setError(err.response?.data || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.page}><ElegantNav />
      <div style={{ ...s.container, maxWidth: 420 }}>
        <h1 style={{ ...s.heading, marginBottom: '0.25rem' }}>Create account</h1>
        <p style={s.subheading}>at {shop?.name}</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[['fullName','Full name','text'],['email','Email address','email'],['password','Password','password']].map(([f,l,t]) => (
            <div style={s.formGroup} key={f}><label style={s.label}>{l}</label><input type={t} required style={s.input} value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} /></div>
          ))}
          <button type="submit" style={{ ...s.btn, width: '100%', marginTop: '1rem' }} disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#8a7a66' }}>
          Already a member? <Link to="/login" style={{ color: '#1a1208' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
