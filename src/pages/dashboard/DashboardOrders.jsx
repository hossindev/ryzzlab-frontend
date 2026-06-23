import { useState } from 'react';
import { ordersApi } from '../../api/orders.js';
import DashboardLayout from './DashboardLayout.jsx';
import { ds, STATUS_COLORS } from './styles.js';
import Spinner from '../../components/Spinner.jsx';

const ALL_STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED'];

export default function DashboardOrders() {
  const [subdomain, setSubdomain] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const fetchOrders = async () => {
    if (!subdomain.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await ordersApi.getShopOrders(subdomain.trim());
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
      setStatusMsg(`Order updated to ${newStatus}`);
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data || 'Failed to update status.');
    }
  };

  return (
    <DashboardLayout>
      <h1 style={ds.heading}>Orders</h1>
      <p style={ds.sub}>View and manage all orders for your shop.</p>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input
          style={{ ...ds.input, maxWidth: 280 }}
          placeholder="your-subdomain"
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
        />
        <button style={ds.btn} onClick={fetchOrders} disabled={loading}>Load orders</button>
      </div>

      {error && <div style={ds.error}>{error}</div>}
      {statusMsg && <div style={ds.success}>{statusMsg}</div>}
      {loading && <Spinner />}

      {!loading && orders.length > 0 && (
        <div style={ds.card}>
          <table style={ds.table}>
            <thead>
              <tr>
                <th style={ds.th}>Order ID</th>
                <th style={ds.th}>Date</th>
                <th style={ds.th}>Customer</th>
                <th style={ds.th}>Total</th>
                <th style={ds.th}>Status</th>
                <th style={ds.th}>Update status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td style={{ ...ds.td, fontFamily: 'monospace', fontSize: '0.8rem', color: '#6b7280' }}>
                    #{order.orderId.slice(0, 8).toUpperCase()}
                  </td>
                  <td style={ds.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={ds.td}>{order.customerEmail || '—'}</td>
                  <td style={ds.td}>€{parseFloat(order.totalPrice).toFixed(2)}</td>
                  <td style={ds.td}>
                    <span style={ds.badge(STATUS_COLORS[order.status])}>{order.status}</span>
                  </td>
                  <td style={ds.td}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      style={{ ...ds.select, width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && orders.length === 0 && subdomain && !error && (
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No orders found for this subdomain.</p>
      )}
    </DashboardLayout>
  );
}
