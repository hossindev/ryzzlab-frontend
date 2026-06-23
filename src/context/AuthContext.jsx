import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children, subdomain }) {
  const customerKey = subdomain ? `token_${subdomain}` : null;

  const [ownerToken, setOwnerToken] = useState(() => localStorage.getItem('owner_token'));
  const [customerToken, setCustomerToken] = useState(() =>
    customerKey ? localStorage.getItem(customerKey) : null
  );

  // Listen for global logout events (triggered by 401 interceptor)
  useEffect(() => {
    const handleOwnerLogout = () => {
      setOwnerToken(null);
    };
    const handleCustomerLogout = () => {
      setCustomerToken(null);
    };
    window.addEventListener('auth:owner:logout', handleOwnerLogout);
    window.addEventListener('auth:customer:logout', handleCustomerLogout);
    return () => {
      window.removeEventListener('auth:owner:logout', handleOwnerLogout);
      window.removeEventListener('auth:customer:logout', handleCustomerLogout);
    };
  }, []);

  // --- Owner actions ---
  const loginOwner = useCallback(async (email, password) => {
    const res = await authApi.loginOwner(email, password);
    const token = res.data.token;
    localStorage.setItem('owner_token', token);
    setOwnerToken(token);
    return token;
  }, []);

  const registerOwner = useCallback(async (email, password, fullName) => {
    const res = await authApi.registerOwner(email, password, fullName);
    const token = res.data.token;
    localStorage.setItem('owner_token', token);
    setOwnerToken(token);
    return token;
  }, []);

  const logoutOwner = useCallback(() => {
    localStorage.removeItem('owner_token');
    setOwnerToken(null);
  }, []);

  // --- Customer actions ---
  const loginCustomer = useCallback(
    async (email, password) => {
      if (!subdomain) throw new Error('No subdomain context');
      const res = await authApi.loginCustomer(email, password, subdomain);
      const token = res.data.token;
      localStorage.setItem(`token_${subdomain}`, token);
      setCustomerToken(token);
      return token;
    },
    [subdomain]
  );

  const registerCustomer = useCallback(
    async (email, password, fullName) => {
      if (!subdomain) throw new Error('No subdomain context');
      const res = await authApi.registerCustomer(email, password, fullName, subdomain);
      const token = res.data.token;
      localStorage.setItem(`token_${subdomain}`, token);
      setCustomerToken(token);
      return token;
    },
    [subdomain]
  );

  const logoutCustomer = useCallback(() => {
    if (!subdomain) return;
    localStorage.removeItem(`token_${subdomain}`);
    setCustomerToken(null);
  }, [subdomain]);

  return (
    <AuthContext.Provider
      value={{
        ownerToken,
        customerToken,
        isOwnerLoggedIn: !!ownerToken,
        isCustomerLoggedIn: !!customerToken,
        loginOwner,
        registerOwner,
        logoutOwner,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
