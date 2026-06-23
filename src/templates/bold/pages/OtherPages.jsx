import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { addressApi } from '../../../api/address.js';
import { ordersApi } from '../../../api/orders.js';
import { BoldNav, boldStyles as s } from '../components/Nav.jsx';
import Spinner from '../../../components/Spinner.jsx';

export function CartPage() {
  const { items, loading, error, total, fetchCart, updateItem, removeItem } = useCart();
  const { isCustomerLoggedIn } = useAuth();
  const { shop } = useShop();
  const nav = useNavigate();

  useEffect(() => {
    if (shop) { document.title = `CART — ${shop.name.toUpperCase()}`; if (isCustomerLoggedIn) fetchCart(); }
  }, [shop, isCustomerLoggedIn]);

  if (!isCustomerLoggedIn) return (
    <div style={s.page}><BoldNav />
      <div style={{ ...s.container, textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: '2rem' }}>SIGN IN TO ACCESS YOUR CART</p>
        <Link to="/login" style={{ ...s.btn, textDecoration: 'none', display: 'inline-block' }}>SIGN IN</Link>
      </div>
    </div>
  );

  return (
    <div style={s.page}><BoldNav />
      <div style={s.container}>
        <h1 style={{ ...s.heading, fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '2rem' }}>YOUR CART</h1>
        {loading && <Spinner color="#ff3b00" />}
        {!loading && items.length === 0 && <p style={{ color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Empty. <Link to="/" style={{ color: '#ff3b00' }}>Shop now</Link></p>}
        {items.map((item) => (
          <div key={item.cartId} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderBottom: '1px solid #1a1a1a', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <img src={item.imageUrl || `https://placehold.co/80x80/111/333`} alt={item.productName} style={{ width: 80, height: 80, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{item.productName}</div>
              <div style={{ color: '#ff3b00', fontSize: '0.875rem', fontWeight: 900 }}>€{parseFloat(item.unitPrice).toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => updateItem(item.cartId, item.quantity - 1)} style={{ ...s.btnOutline, padding: '0.25rem 0.75rem' }}>−</button>
              <span style={{ fontWeight: 900 }}>{item.quantity}</span>
              <button onClick={() => updateItem(item.cartId, item.quantity + 1)} style={{ ...s.btnOutline, padding: '0.25rem 0.75rem' }}>+</button>
            </div>
            <div style={{ fontWeight: 900, color: '#ff3b00', minWidth: 80, textAlign: 'right' }}>€{parseFloat(item.lineTotal).toFixed(2)}</div>
            <button onClick={() => removeItem(item.cartId)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
          </div>
        ))}
        {items.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3rem', marginTop: '1rem' }}>
            <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>TOTAL <span style={{ color: '#ff3b00' }}>€{total.toFixed(2)}</span></div>
            <button style={s.btn} onClick={() => nav('/checkout')}>CHECKOUT</button>
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
    document.title = `CHECKOUT — ${shop.name.toUpperCase()}`;
    fetchCart();
    addressApi.getAllAddresses(shop.subdomain)
      .then((res) => { setAddresses(res.data); const def = res.data.find(a => a.isDefault); if (def) setSelectedAddress(def.addressId); else if (res.data.length > 0) setSelectedAddress(res.data[0].addressId); })
      .catch(() => {}).finally(() => setLoadingAddr(false));
  }, [shop]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressApi.createAddress(shop.subdomain, form);
      const upd = await addressApi.getAllAddresses(shop.subdomain);
      setAddresses(upd.data); setSelectedAddress(res.data.addressId); setShowForm(false);
    } catch { setError('Failed to save address.'); }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) { setError('Select an address.'); return; }
    setPlacing(true); setError('');
    try { await ordersApi.checkout(shop.subdomain, selectedAddress); clearCart(); setSuccess('Order placed!'); setTimeout(() => nav('/orders'), 2000); }
    catch (err) { setError(err.response?.data || 'Checkout failed.'); }
    finally { setPlacing(false); }
  };

  return (
    <div style={s.page}><BoldNav />
      <div style={s.container}>
        <h1 style={{ ...s.heading, fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '2rem' }}>CHECKOUT</h1>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.15em', color: '#666', textTransform: 'uppercase', marginBottom: '1rem' }}>Delivery address</div>
            {loadingAddr ? <Spinner color="#ff3b00" /> : (
              <>
                {addresses.map(addr => (
                  <label key={addr.addressId} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '1rem', border: `2px solid ${selectedAddress === addr.addressId ? '#ff3b00' : '#222'}`, marginBottom: '0.75rem', cursor: 'pointer' }}>
                    <input type="radio" name="address" value={addr.addressId} checked={selectedAddress === addr.addressId} onChange={() => setSelectedAddress(addr.addressId)} />
                    <div>
                      <div style={{ fontWeight: 900 }}>{addr.street}</div>
                      <div style={{ color: '#666', fontSize: '0.8rem' }}>{addr.city}, {addr.postalCode}, {addr.country}</div>
                    </div>
                  </label>
                ))}
                <button onClick={() => setShowForm(!showForm)} style={{ ...s.btnOutline, fontSize: '0.75rem', padding: '0.5rem 1rem' }}>+ ADD ADDRESS</button>
                {showForm && (
                  <form onSubmit={handleAddAddress} style={{ marginTop: '1.25rem' }}>
                    {[['street','Street'],['city','City'],['postalCode','Postal code'],['country','Country']].map(([f, l]) => (
                      <div style={s.formGroup} key={f}>
                        <label style={s.label}>{l}</label>
                        <input required style={s.input} value={form[f]} onChange={(e) => setForm({...form, [f]: e.target.value})} />
                      </div>
                    ))}
                    <button type="submit" style={s.btn}>SAVE</button>
                  </form>
                )}
              </>
            )}
          </div>
          <div style={{ border: '2px solid #222', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.15em', color: '#666', textTransform: 'uppercase', marginBottom: '1rem' }}>Order</div>
            {items.map(item => (
              <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{item.productName} ×{item.quantity}</span>
                <span style={{ color: '#ff3b00' }}>€{parseFloat(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #222', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}>
              <span>TOTAL</span><span style={{ color: '#ff3b00' }}>€{total.toFixed(2)}</span>
            </div>
            <button style={{ ...s.btn, width: '100%', marginTop: '1.5rem' }} onClick={handleCheckout} disabled={placing}>
              {placing ? '...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS = { PENDING: '#f59e0b', PAID: '#3b82f6', SHIPPED: '#8b5cf6', DELIVERED: '#00ff88', CANCELED: '#ff3b00' };

export function OrderHistoryPage() {
  const { shop } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shop) return;
    document.title = `ORDERS — ${shop.name.toUpperCase()}`;
    ordersApi.getOrderHistory(shop.subdomain).then(r => setOrders(r.data)).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [shop]);

  return (
    <div style={s.page}><BoldNav />
      <div style={s.container}>
        <h1 style={{ ...s.heading, fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '2rem' }}>YOUR ORDERS</h1>
        {loading && <Spinner color="#ff3b00" />}
        {error && <div style={s.error}>{error}</div>}
        {!loading && orders.length === 0 && <p style={{ color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>No orders yet.</p>}
        {orders.map(order => (
          <div key={order.orderId} style={{ border: '1px solid #1a1a1a', marginBottom: '1.5rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.875rem' }}>#{order.orderId.slice(0,8).toUpperCase()}</div>
              <span style={{ color: STATUS_COLORS[order.status], fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{order.status}</span>
            </div>
            {order.orderItems?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                <span>{item.productName} ×{item.quantity}</span>
                <span style={{ color: '#ff3b00' }}>€{parseFloat(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #1a1a1a', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', fontWeight: 900 }}>
              TOTAL <span style={{ color: '#ff3b00', marginLeft: '0.5rem' }}>€{parseFloat(order.totalPrice).toFixed(2)}</span>
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
    <div style={s.page}><BoldNav />
      <div style={{ ...s.container, maxWidth: 440 }}>
        <h1 style={{ ...s.heading, fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem' }}>SIGN IN</h1>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.formGroup}><label style={s.label}>Email</label><input type="email" required style={s.input} value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div style={s.formGroup}><label style={s.label}>Password</label><input type="password" required style={s.input} value={password} onChange={e => setPassword(e.target.value)} /></div>
          <button type="submit" style={{ ...s.btn, width: '100%' }} disabled={loading}>{loading ? '...' : 'SIGN IN'}</button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          No account? <Link to="/register" style={{ color: '#ff3b00' }}>Create one</Link>
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
    <div style={s.page}><BoldNav />
      <div style={{ ...s.container, maxWidth: 440 }}>
        <h1 style={{ ...s.heading, fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem' }}>CREATE ACCOUNT</h1>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[['fullName','Full name','text'],['email','Email','email'],['password','Password','password']].map(([f,l,t]) => (
            <div style={s.formGroup} key={f}><label style={s.label}>{l}</label><input type={t} required style={s.input} value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} /></div>
          ))}
          <button type="submit" style={{ ...s.btn, width: '100%' }} disabled={loading}>{loading ? '...' : 'CREATE ACCOUNT'}</button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>
          Already a member? <Link to="/login" style={{ color: '#ff3b00' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
