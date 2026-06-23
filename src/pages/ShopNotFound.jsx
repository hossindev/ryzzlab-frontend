export default function ShopNotFound() {
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
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏪</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
        Shop not found
      </h1>
      <p style={{ color: '#666', maxWidth: 380, lineHeight: 1.6 }}>
        This shop doesn't exist or may have been removed. Double-check the address and try again.
      </p>
      <a
        href="https://ryzzlab.xyz"
        style={{
          marginTop: '2rem',
          color: '#6366f1',
          fontSize: '0.875rem',
          textDecoration: 'none',
        }}
      >
        ← Back to ryzzlab
      </a>
    </div>
  );
}
