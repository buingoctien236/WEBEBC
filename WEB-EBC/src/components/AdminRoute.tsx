import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const token = localStorage.getItem('admin_token');

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
