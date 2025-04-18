import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import LoadingSpinner from './ui/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(false);

  // Check authentication when route changes, but only if not already checking
  useEffect(() => {
    const verifyAuth = async () => {
      // Only check if we have a user but it might be stale
      if (user && !isChecking) {
        setIsChecking(true);
        try {
          // Simple check - if we have a user with admin role, we're good
          console.log('Verifying admin access for user:', user.email, 'Role:', user.role);
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          setIsChecking(false);
        }
      }
    };

    verifyAuth();
  }, [location.pathname, user]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If not admin, redirect to home
  if (user.role !== 'admin') {
    console.log('User is not an admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is an admin, render the children
  return children;
};

export default AdminRoute; 