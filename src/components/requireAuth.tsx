// components/RequireAuth.jsx
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAuth() {
  // Tuỳ dự án: token, context, Redux…
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
