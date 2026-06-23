import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ds } from './styles.js';

export default function OwnerLogin() {
  const { loginOwner } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginOwner(email, password);
      nav('/');
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>ryzzlab</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111', marginBottom: '0.25rem' }}>Owner sign in</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Manage your shop and products.</p>
        </div>

        {error && <div style={ds.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={ds.formGroup}>
            <label style={ds.label}>Email</label>
            <input type="email" required style={ds.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div style={ds.formGroup}>
            <label style={ds.label}>Password</label>
            <input type="password" required style={ds.input} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" style={{ ...ds.btn, width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
