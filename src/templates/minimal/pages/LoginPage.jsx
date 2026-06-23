import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useShop } from '../../../context/ShopContext.jsx';
import { MinimalNav, minimalStyles as s } from '../components/Nav.jsx';

export default function LoginPage() {
  const { loginCustomer } = useAuth();
  const { shop } = useShop();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginCustomer(email, password);
      nav(from, { replace: true });
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <MinimalNav />
      <div style={{ ...s.container, maxWidth: 420 }}>
        <h1 style={{ ...s.heading, marginBottom: '0.25rem' }}>Sign in</h1>
        <p style={s.subheading}>to your {shop?.name} account</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.formGroup}>
            <label style={s.label}>Email</label>
            <input type="email" required style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Password</label>
            <input type="password" required style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" style={{ ...s.btn, width: '100%' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#666' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#111', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
