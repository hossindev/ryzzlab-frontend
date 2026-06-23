import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useShop } from '../../../context/ShopContext.jsx';
import { MinimalNav, minimalStyles as s } from '../components/Nav.jsx';

export default function RegisterPage() {
  const { registerCustomer } = useAuth();
  const { shop } = useShop();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerCustomer(form.email, form.password, form.fullName);
      nav('/');
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <MinimalNav />
      <div style={{ ...s.container, maxWidth: 420 }}>
        <h1 style={{ ...s.heading, marginBottom: '0.25rem' }}>Create account</h1>
        <p style={s.subheading}>at {shop?.name}</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[['fullName','Full name','text'],['email','Email','email'],['password','Password','password']].map(([field, label, type]) => (
            <div style={s.formGroup} key={field}>
              <label style={s.label}>{label}</label>
              <input type={type} required style={s.input} value={form[field]} onChange={(e) => setForm({...form, [field]: e.target.value})} />
            </div>
          ))}
          <button type="submit" style={{ ...s.btn, width: '100%' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#111', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
