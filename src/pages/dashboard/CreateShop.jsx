import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopApi } from '../../api/shop.js';
import DashboardLayout from './DashboardLayout.jsx';
import { ds } from './styles.js';

const TEMPLATES = ['minimal', 'bold', 'elegant'];

export default function CreateShop() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', subdomain: '', description: '', templateName: 'minimal' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: field === 'subdomain' ? value.toLowerCase().replace(/[^a-z0-9-]/g, '') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await shopApi.createShop(form);
      setSuccess(`Shop "${form.name}" created! Your storefront will be at ${form.subdomain}.ryzzlab.xyz`);
      setTimeout(() => nav('/shop/customize'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to create shop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 style={ds.heading}>Create a shop</h1>
      <p style={ds.sub}>Set up your storefront. You can customise branding next.</p>

      <div style={{ maxWidth: 560 }}>
        {error && <div style={ds.error}>{error}</div>}
        {success && <div style={ds.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={ds.card}>
          <div style={ds.formGroup}>
            <label style={ds.label}>Shop name</label>
            <input required style={ds.input} value={form.name} onChange={set('name')} placeholder="e.g. Nike Store" />
          </div>

          <div style={ds.formGroup}>
            <label style={ds.label}>Subdomain</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                required
                style={{ ...ds.input, flex: 1 }}
                value={form.subdomain}
                onChange={set('subdomain')}
                placeholder="nike"
                pattern="[a-z0-9-]+"
                title="Lowercase letters, numbers, hyphens only"
              />
              <span style={{ color: '#6b7280', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>.ryzzlab.xyz</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem' }}>
              Lowercase letters, numbers and hyphens only.
            </p>
          </div>

          <div style={ds.formGroup}>
            <label style={ds.label}>Description</label>
            <textarea style={ds.textarea} value={form.description} onChange={set('description')} placeholder="A short description of your shop…" />
          </div>

          <div style={ds.formGroup}>
            <label style={ds.label}>Template</label>
            <select style={ds.select} value={form.templateName} onChange={set('templateName')}>
              {TEMPLATES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem' }}>
              Determines the visual style of your storefront.
            </p>
          </div>

          <button type="submit" style={ds.btn} disabled={loading}>
            {loading ? 'Creating…' : 'Create shop'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
