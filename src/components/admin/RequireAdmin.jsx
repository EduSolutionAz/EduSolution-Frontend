import { Navigate, useLocation } from 'react-router-dom';
import { canAccessAdmin } from '../../services/session';
import { ADMIN_TOKEN_KEY } from '../../config/api';
import { readToken } from '../../services/httpClient';
import { isTokenExpired } from '../../services/session';

export default function RequireAdmin({ children }) {
  const location = useLocation();

  if (!canAccessAdmin()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  // Extra safety: ensure token exists and not expired
  const token = readToken(ADMIN_TOKEN_KEY);
  if (!token || isTokenExpired('eduSoliton_admin_token_ttl')) {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem('eduSoliton_admin_token_ttl');
      sessionStorage.removeItem('eduSoliton_admin_verified');
    } catch {}
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
