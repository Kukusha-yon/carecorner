import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser as getCurrentUserService,
  login as loginService,
  register as registerService,
  logout as logoutService,
  updateProfile as updateProfileService,
  changePassword as changePasswordService,
  login as authLogin,
  logout as authLogout,
  getStoredUser,
  isAuthenticated
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
    // Check for stored user on mount
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authLogin(email, password);
      
      // Validate the response data
      if (!data || !data.token) {
        throw new Error('Invalid login response');
      }
      
      // Debug user data
      console.log('Login response data:', data);
      console.log('User data:', data.user);
      console.log('User role:', data.user?.role);
      
      setUser(data.user || null);
      setLoading(false);
      
      // Navigate based on user role
      if (data.user && data.user.role === 'admin') {
        console.log('User is admin, navigating to admin dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('User is not admin, navigating to home');
        navigate('/', { replace: true });
      }
      
      return data;
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Login failed');
      throw error;
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

  const logout = () => {
    authLogout();
    setUser(null);
    navigate('/login');
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
    isAuthenticated: () => isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 