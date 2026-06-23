import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import OwnerProtectedRoute from '../components/OwnerProtectedRoute.jsx';
import DashboardHome from './dashboard/DashboardHome.jsx';
import OwnerLogin from './dashboard/OwnerLogin.jsx';
import OwnerRegister from './dashboard/OwnerRegister.jsx';
import CreateShop from './dashboard/CreateShop.jsx';
import CustomizeShop from './dashboard/CustomizeShop.jsx';
import ProductsList from './dashboard/ProductsList.jsx';
import CreateProduct from './dashboard/CreateProduct.jsx';
import EditProduct from './dashboard/EditProduct.jsx';
import DashboardOrders from './dashboard/DashboardOrders.jsx';
import NotFound from './NotFound.jsx';

export default function DashboardApp() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<OwnerLogin />} />
      <Route path="/register" element={<OwnerRegister />} />

      {/* Protected */}
      <Route path="/" element={<OwnerProtectedRoute><DashboardHome /></OwnerProtectedRoute>} />
      <Route path="/shop/create" element={<OwnerProtectedRoute><CreateShop /></OwnerProtectedRoute>} />
      <Route path="/shop/customize" element={<OwnerProtectedRoute><CustomizeShop /></OwnerProtectedRoute>} />
      <Route path="/products" element={<OwnerProtectedRoute><ProductsList /></OwnerProtectedRoute>} />
      <Route path="/products/create" element={<OwnerProtectedRoute><CreateProduct /></OwnerProtectedRoute>} />
      <Route path="/products/:productId/edit" element={<OwnerProtectedRoute><EditProduct /></OwnerProtectedRoute>} />
      <Route path="/orders" element={<OwnerProtectedRoute><DashboardOrders /></OwnerProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
