export const ds = {
  heading: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.25rem', color: '#111' },
  sub: { color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' },
  card: { background: '#fff', borderRadius: '10px', border: '1px solid #e9ecef', padding: '1.5rem', marginBottom: '1.25rem' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { width: '100%', padding: '0.6rem 0.875rem', border: '1.5px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#111' },
  textarea: { width: '100%', padding: '0.6rem 0.875rem', border: '1.5px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#111', resize: 'vertical', minHeight: 80 },
  select: { width: '100%', padding: '0.6rem 0.875rem', border: '1.5px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#111' },
  formGroup: { marginBottom: '1rem' },
  btn: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: '7px', padding: '0.65rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnDanger: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: '7px', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnOutline: { background: 'transparent', color: '#6366f1', border: '1.5px solid #6366f1', borderRadius: '7px', padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '7px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' },
  success: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: '7px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' },
  badge: (color) => ({
    display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '100px',
    fontSize: '0.7rem', fontWeight: 700, background: color + '20', color,
  }),
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e9ecef' },
  td: { padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#374151', borderBottom: '1px solid #f3f4f6' },
};

export const STATUS_COLORS = {
  PENDING: '#f59e0b', PAID: '#3b82f6', SHIPPED: '#8b5cf6', DELIVERED: '#10b981', CANCELED: '#ef4444',
};
