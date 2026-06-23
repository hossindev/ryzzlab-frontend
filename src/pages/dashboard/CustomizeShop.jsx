import { useState } from 'react';
import { shopApi } from '../../api/shop.js';
import DashboardLayout from './DashboardLayout.jsx';
import { ds } from './styles.js';

export default function CustomizeShop() {
  const [form, setForm] = useState({
    shopId: '',
    logoUrl: '',
    bannerUrl: '',
    tagline: '',
    primaryColor: '#111111',
    secondaryColor: '#666666',
    font: 'Inter',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shopId.trim()) { setError('Shop ID is required.'); return; }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await shopApi.updateCustomization(form);
      setSuccess('Customisation saved successfully!');
    } catch (err) {
      setError(err.response?.data || 'Failed to save customisation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 style={ds.heading}>Customise shop</h1>
      <p style={ds.sub}>Update your storefront's branding and appearance.</p>

      <div style={{ maxWidth: 600 }}>
        {error && <div style={ds.error}>{error}</div>}
        {success && <div style={ds.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={ds.card}>
          <div style={ds.formGroup}>
            <label style={ds.label}>Shop ID <span style={{ color: '#ef4444' }}>*</span></label>
            <input required style={ds.input} value={form.shopId} onChange={set('shopId')} placeholder="UUID from your shop record" />
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem' }}>
              Found in the response when you created your shop.
            </p>
          </div>

          <div style={ds.formGroup}>
            <label style={ds.label}>Tagline</label>
            <input style={ds.input} value={form.tagline} onChange={set('tagline')} placeholder="e.g. Just Do It" />
          </div>

          <div style={ds.formGroup}>
            <label style={ds.label}>Logo URL</label>
            <input type="url" style={ds.input} value={form.logoUrl} onChange={set('logoUrl')} placeholder="https://…" />
          </div>

          <div style={ds.formGroup}>
            <label style={ds.label}>Banner URL</label>
            <input type="url" style={ds.input} value={form.bannerUrl} onChange={set('bannerUrl')} placeholder="https://…" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={ds.formGroup}>
              <label style={ds.label}>Primary colour</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={form.primaryColor} onChange={set('primaryColor')} style={{ width: 40, height: 36, border: 'none', padding: 0, cursor: 'pointer', borderRadius: 4 }} />
                <input style={{ ...ds.input, flex: 1 }} value={form.primaryColor} onChange={set('primaryColor')} placeholder="#111111" />
              </div>
            </div>
            <div style={ds.formGroup}>
              <label style={ds.label}>Secondary colour</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={form.secondaryColor} onChange={set('secondaryColor')} style={{ width: 40, height: 36, border: 'none', padding: 0, cursor: 'pointer', borderRadius: 4 }} />
                <input style={{ ...ds.input, flex: 1 }} value={form.secondaryColor} onChange={set('secondaryColor')} placeholder="#666666" />
              </div>
            </div>
          </div>

          <div style={ds.formGroup}>
            <label style={ds.label}>Font</label>
            <select style={ds.select} value={form.font} onChange={set('font')}>
              {['Inter', 'Georgia', 'Helvetica Neue', 'Playfair Display', 'Montserrat', 'Roboto'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={ds.btn} disabled={loading}>
            {loading ? 'Saving…' : 'Save customisation'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
