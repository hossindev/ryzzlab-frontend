import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../../api/products.js';
import DashboardLayout from './DashboardLayout.jsx';
import { ds } from './styles.js';

export default function EditProduct() {
  const { productId } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', price: '', stockQuantity: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Only send fields that have values (partial update)
    const payload = {};
    if (form.name) payload.name = form.name;
    if (form.description) payload.description = form.description;
    if (form.imageUrl) payload.imageUrl = form.imageUrl;
    if (form.price) payload.price = parseFloat(form.price);
    if (form.stockQuantity !== '') payload.stockQuantity = parseInt(form.stockQuantity, 10);

    try {
      await productsApi.updateProduct(productId, payload);
      setSuccess('Product updated!');
    } catch (err) {
      setError(err.response?.data || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 style={ds.heading}>Edit product</h1>
      <p style={ds.sub}>
        Editing product <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', background: '#f3f4f6', padding: '0.1rem 0.4rem', borderRadius: 4 }}>{productId}</code>. Leave a field blank to keep its current value.
      </p>

      <div style={{ maxWidth: 560 }}>
        {error && <div style={ds.error}>{error}</div>}
        {success && <div style={ds.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={ds.card}>
          <div style={ds.formGroup}>
            <label style={ds.label}>Name</label>
            <input style={ds.input} value={form.name} onChange={set('name')} placeholder="Leave blank to keep current" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.label}>Description</label>
            <textarea style={ds.textarea} value={form.description} onChange={set('description')} placeholder="Leave blank to keep current" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.label}>Image URL</label>
            <input type="url" style={ds.input} value={form.imageUrl} onChange={set('imageUrl')} placeholder="Leave blank to keep current" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={ds.formGroup}>
              <label style={ds.label}>Price (€)</label>
              <input type="number" min="0" step="0.01" style={ds.input} value={form.price} onChange={set('price')} placeholder="Leave blank to keep current" />
            </div>
            <div style={ds.formGroup}>
              <label style={ds.label}>Stock quantity</label>
              <input type="number" min="0" style={ds.input} value={form.stockQuantity} onChange={set('stockQuantity')} placeholder="Leave blank to keep current" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" style={ds.btn} disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</button>
            <button type="button" style={ds.btnOutline} onClick={() => nav('/products')}>Cancel</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
