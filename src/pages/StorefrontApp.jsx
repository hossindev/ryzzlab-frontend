import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { getTemplate } from '../templates/index.js';
import { CartProvider } from '../context/CartContext.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import ShopNotFound from './ShopNotFound.jsx';
import Spinner from '../components/Spinner.jsx';

function TemplateRoutes({ subdomain }) {
  const { shop, loading, error, notFound } = useShop();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (notFound) return <ShopNotFound />;

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Failed to load shop</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#111',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 1.75rem',
            borderRadius: '7px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!shop) return null;

  // Resolve template — falls back to minimal if unknown
  const TemplateSuite = getTemplate(shop.templateName);

  return (
    <CartProvider subdomain={subdomain}>
      <Suspense
        fallback={
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner />
          </div>
        }
      >
        {/* Inject shop CSS custom properties for templates that want them */}
        {shop.customization && (
          <style>{`
            :root {
              --shop-primary: ${shop.customization.primaryColor || '#111111'};
              --shop-secondary: ${shop.customization.secondaryColor || '#666666'};
              --shop-font: ${shop.customization.font || 'Inter'};
            }
          `}</style>
        )}
        <TemplateSwitcher TemplateSuite={TemplateSuite} />
      </Suspense>
    </CartProvider>
  );
}

function TemplateSwitcher({ TemplateSuite }) {
  return (
    <Routes>
      <Route path="/" element={<TemplateSuite.HomePage />} />
      <Route path="/products/:slug" element={<TemplateSuite.ProductDetailPage />} />
      <Route path="/cart" element={<TemplateSuite.CartPage />} />
      <Route path="/login" element={<TemplateSuite.LoginPage />} />
      <Route path="/register" element={<TemplateSuite.RegisterPage />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <TemplateSuite.CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <TemplateSuite.OrderHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function StorefrontApp({ subdomain }) {
  return <TemplateRoutes subdomain={subdomain} />;
}
