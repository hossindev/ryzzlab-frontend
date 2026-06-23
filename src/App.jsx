import { BrowserRouter } from 'react-router-dom';
import { getSubdomain } from './utils/subdomain.js';
import { AuthProvider } from './context/AuthContext.jsx';
import { ShopProvider } from './context/ShopContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import StorefrontApp from './pages/StorefrontApp.jsx';
import DashboardApp from './pages/DashboardApp.jsx';

const subdomain = getSubdomain();

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider subdomain={subdomain}>
          {subdomain ? (
            // Storefront zone: nike.ryzzlab.xyz
            <ShopProvider subdomain={subdomain}>
              <StorefrontApp subdomain={subdomain} />
            </ShopProvider>
          ) : (
            // Dashboard zone: ryzzlab.xyz / localhost
            <DashboardApp />
          )}
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
