import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const AdminRoute = ({ children }) => {
  const { user, loading, checkAuth } = useAuth();
  const location = useLocation();

  // Check authentication when route changes
  useEffect(() => {
    checkAuth();
  }, [location.pathname, checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]"></div>
      </div>
    );
  }

  if (!user && !['/login', '/register', '/'].includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/profile-settings" replace />;
  }

  return children;
};

export default AdminRoute; 