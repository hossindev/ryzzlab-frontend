import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../../api/products.js';
import DashboardLayout from './DashboardLayout.jsx';
import { ds } from './styles.js';

export default function CreateProduct() {
  const nav = useNavigate();
  const [form, setForm] = useState({ shopId: '', name: '', description: '', imageUrl: '', price: '', stockQuantity: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await productsApi.createProduct({
        ...form,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity, 10),
      });
      setSuccess('Product created!');
      setTimeout(() => nav('/products'), 1500);
    } catch (err) {
      setError(err.response?.data || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 style={ds.heading}>Add product</h1>
      <p style={ds.sub}>Create a new product for your shop.</p>

      <div style={{ maxWidth: 560 }}>
        {error && <div style={ds.error}>{error}</div>}
        {success && <div style={ds.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={ds.card}>
          <div style={ds.formGroup}>
            <label style={ds.label}>Shop ID <span style={{ color: '#ef4444' }}>*</span></label>
            <input required style={ds.input} value={form.shopId} onChange={set('shopId')} placeholder="UUID of the shop" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.label}>Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input required style={ds.input} value={form.name} onChange={set('name')} placeholder="e.g. Air Max 90" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.label}>Description</label>
            <textarea style={ds.textarea} value={form.description} onChange={set('description')} placeholder="Product description…" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.label}>Image URL</label>
            <input type="url" style={ds.input} value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://…" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={ds.formGroup}>
              <label style={ds.label}>Price (€) <span style={{ color: '#ef4444' }}>*</span></label>
              <input required type="number" min="0" step="0.01" style={ds.input} value={form.price} onChange={set('price')} placeholder="0.00" />
            </div>
            <div style={ds.formGroup}>
              <label style={ds.label}>Stock quantity <span style={{ color: '#ef4444' }}>*</span></label>
              <input required type="number" min="0" style={ds.input} value={form.stockQuantity} onChange={set('stockQuantity')} placeholder="0" />
            </div>
          </div>
          <button type="submit" style={ds.btn} disabled={loading}>
            {loading ? 'Creating…' : 'Create product'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
