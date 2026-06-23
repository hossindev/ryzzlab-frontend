import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', system-ui, sans-serif",
        background: '#fafafa',
        color: '#111',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#e5e7eb' }}>404</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Page not found</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          background: '#111',
          color: '#fff',
          padding: '0.75rem 1.75rem',
          borderRadius: '7px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
        }}
      >
        Go home
      </Link>
    </div>
  );
}
