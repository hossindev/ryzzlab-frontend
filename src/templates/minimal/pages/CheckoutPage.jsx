import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { addressApi } from '../../../api/address.js';
import { ordersApi } from '../../../api/orders.js';
import { MinimalNav, minimalStyles as s } from '../components/Nav.jsx';
import Spinner from '../../../components/Spinner.jsx';

export default function CheckoutPage() {
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
    addressApi.getAllAddresses(shop.subdomain)
      .then((res) => {
        setAddresses(res.data);
        const def = res.data.find((a) => a.isDefault);
        if (def) setSelectedAddress(def.addressId);
        else if (res.data.length > 0) setSelectedAddress(res.data[0].addressId);
      })
      .catch(() => {})
      .finally(() => setLoadingAddr(false));
  }, [shop]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressApi.createAddress(shop.subdomain, { ...form });
      const updated = await addressApi.getAllAddresses(shop.subdomain);
      setAddresses(updated.data);
      setSelectedAddress(res.data.addressId);
      setShowForm(false);
      setForm({ street: '', city: '', postalCode: '', country: '', isDefault: false });
    } catch (err) {
      setError('Failed to save address.');
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) { setError('Please select an address.'); return; }
    setPlacing(true);
    setError('');
    try {
      await ordersApi.checkout(shop.subdomain, selectedAddress);
      clearCart();
      setSuccess('Order placed! Redirecting to your orders…');
      setTimeout(() => nav('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Checkout failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={s.page}>
      <MinimalNav />
      <div style={s.container}>
        <h1 style={s.heading}>Checkout</h1>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Delivery address</h2>
            {loadingAddr ? <Spinner /> : (
              <>
                {addresses.map((addr) => (
                  <label key={addr.addressId} style={{
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                    padding: '0.875rem 1rem', background: '#fff', borderRadius: '8px',
                    border: `1.5px solid ${selectedAddress === addr.addressId ? '#111' : '#e5e7eb'}`,
                    marginBottom: '0.75rem', cursor: 'pointer',
                  }}>
                    <input type="radio" name="address" value={addr.addressId} checked={selectedAddress === addr.addressId} onChange={() => setSelectedAddress(addr.addressId)} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{addr.street}</div>
                      <div style={{ color: '#666', fontSize: '0.875rem' }}>{addr.city}, {addr.postalCode}, {addr.country}</div>
                    </div>
                  </label>
                ))}
                <button onClick={() => setShowForm(!showForm)} style={{ ...s.btnOutline, fontSize: '0.85rem', padding: '0.5rem 1rem', marginTop: '0.5rem' }}>
                  {showForm ? 'Cancel' : '+ Add address'}
                </button>
                {showForm && (
                  <form onSubmit={handleAddAddress} style={{ marginTop: '1.25rem' }}>
                    {[['street','Street'],['city','City'],['postalCode','Postal code'],['country','Country']].map(([field, label]) => (
                      <div style={s.formGroup} key={field}>
                        <label style={s.label}>{label}</label>
                        <input required style={s.input} value={form[field]} onChange={(e) => setForm({...form, [field]: e.target.value})} />
                      </div>
                    ))}
                    <button type="submit" style={s.btn}>Save address</button>
                  </form>
                )}
              </>
            )}
          </div>
          <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Order summary</h2>
            {items.map((item) => (
              <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span>{item.productName} × {item.quantity}</span>
                <span>€{parseFloat(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <button style={{ ...s.btn, width: '100%', marginTop: '1.5rem' }} onClick={handleCheckout} disabled={placing}>
              {placing ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
