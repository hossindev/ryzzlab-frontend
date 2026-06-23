/**
 * Detects the shop subdomain from the current hostname.
 * Returns null if we're on the platform root (dashboard zone).
 */
export function getSubdomain() {
  // Allow override in local dev via .env.local
  if (import.meta.env.VITE_DEV_SUBDOMAIN) {
    return import.meta.env.VITE_DEV_SUBDOMAIN;
  }

  const hostname = window.location.hostname;

  // localhost = dashboard zone
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  const parts = hostname.split('.');

  // ryzzlab.xyz or www.ryzzlab.xyz = dashboard zone
  if (parts.length <= 2) return null;
  if (parts[0] === 'www') return null;
  if (parts[0] === 'dashboard') return null;

  // nike.ryzzlab.xyz → subdomain = "nike"
  return parts[0];
}
