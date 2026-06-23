import { useEffect, useState } from 'react';
import { useShop } from '../../../context/ShopContext.jsx';
import { ordersApi } from '../../../api/orders.js';
import { MinimalNav, minimalStyles as s } from '../components/Nav.jsx';
import Spinner from '../../../components/Spinner.jsx';

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  PAID: '#3b82f6',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#10b981',
  CANCELED: '#ef4444',
};

export default function OrderHistoryPage() {
  const { shop } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shop) return;
    document.title = `Orders — ${shop.name}`;
    ordersApi.getOrderHistory(shop.subdomain)
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [shop]);

  return (
    <div style={s.page}>
      <MinimalNav />
      <div style={s.container}>
        <h1 style={s.heading}>Your orders</h1>
        {loading && <Spinner />}
        {error && <div style={s.error}>{error}</div>}
        {!loading && orders.length === 0 && <p style={{ color: '#999' }}>No orders yet.</p>}
        {orders.map((order) => (
          <div key={order.orderId} style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Order #{order.orderId.slice(0,8).toUpperCase()}</div>
                <div style={{ color: '#999', fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <span style={{
                background: STATUS_COLORS[order.status] + '20',
                color: STATUS_COLORS[order.status],
                padding: '0.25rem 0.75rem',
                borderRadius: '100px',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}>{order.status}</span>
            </div>
            {order.orderItems?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#555', marginBottom: '0.25rem' }}>
                <span>{item.productName} × {item.quantity}</span>
                <span>€{parseFloat(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', fontWeight: 700 }}>
              Total: €{parseFloat(order.totalPrice).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
