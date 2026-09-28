import { Navigate, useLocation } from 'react-router-dom';
import { canAccessAdmin } from '../../services/session';

export default function RequireAdmin({ children }) {
  const location = useLocation();

  if (!canAccessAdmin()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
