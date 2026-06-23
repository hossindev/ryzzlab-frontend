import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ds } from './styles.js';

export default function OwnerRegister() {
  const { registerOwner } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerOwner(form.email, form.password, form.fullName);
      nav('/');
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>ryzzlab</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111', marginBottom: '0.25rem' }}>Create owner account</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Start selling in minutes.</p>
        </div>

        {error && <div style={ds.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={ds.formGroup}>
            <label style={ds.label}>Full name</label>
            <input type="text" required style={ds.input} value={form.fullName} onChange={set('fullName')} placeholder="Jane Smith" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.label}>Email</label>
            <input type="email" required style={ds.input} value={form.email} onChange={set('email')} placeholder="you@example.com" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.label}>Password</label>
            <input type="password" required style={ds.input} value={form.password} onChange={set('password')} placeholder="••••••••" minLength={6} />
          </div>
          <button type="submit" style={{ ...ds.btn, width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
