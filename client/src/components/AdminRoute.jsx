import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const AdminRoute = ({ children }) => {
  const { user, loading, checkAuth } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(false);

  // Check authentication when route changes, but only if not already checking
  useEffect(() => {
    const verifyAuth = async () => {
      // Only check if we have a user but it might be stale
      if (user && !isChecking) {
        setIsChecking(true);
        try {
          await checkAuth();
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          setIsChecking(false);
        }
      }
    };

    verifyAuth();
  }, [location.pathname, checkAuth, user, isChecking]);

  if (loading || isChecking) {
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