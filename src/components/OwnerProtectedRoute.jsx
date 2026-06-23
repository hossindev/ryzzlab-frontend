import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function OwnerProtectedRoute({ children }) {
  const { isOwnerLoggedIn } = useAuth();
  const location = useLocation();

  if (!isOwnerLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
