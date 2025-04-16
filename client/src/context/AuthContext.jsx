import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser as getCurrentUserService,
  login as loginService,
  register as registerService,
  logout as logoutService,
  updateProfile as updateProfileService,
  changePassword as changePasswordService,
  refreshToken as refreshTokenService
} from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication status...');
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!token) {
        console.log('No token found in localStorage');
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        console.log('Token found, verifying with server...');
        const user = await getCurrentUserService();
        
        if (user && user._id) {
          console.log('User authenticated successfully:', user.email, 'Role:', user.role);
          setUser(user);
        } else {
          console.log('Server returned invalid user data');
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        
        // If we have a refresh token, try to refresh the access token
        if (refreshToken && error.response?.status === 401) {
          try {
            console.log('Attempting to refresh token...');
            const response = await refreshTokenService({ refreshToken });
            
            if (response && response.accessToken) {
              console.log('Token refreshed successfully');
              localStorage.setItem('token', response.accessToken);
              
              if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
              }
              
              // Try to get the user again with the new token
              const user = await getCurrentUserService();
              if (user && user._id) {
                console.log('User authenticated successfully after token refresh:', user.email, 'Role:', user.role);
                setUser(user);
                return;
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Clear tokens on refresh failure
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        }
        
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await loginService(credentials);
      
      // Ensure we have a valid user object with role before setting state
      if (response && response._id && response.role) {
        console.log('Setting user with role:', response.role);
        setUser(response);
        return response;
      } else {
        throw new Error('Invalid user data received from server');
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerService(userData);
      // Don't set the user or tokens here, just return success
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await updateProfileService(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await changePasswordService(passwordData);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 