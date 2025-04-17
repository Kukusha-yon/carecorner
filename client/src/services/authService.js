import api from './api';

// Login user
export const login = async (email, password) => {
  try {
    console.log('Attempting login for:', email);
    
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response received:', response.status);
    
    // Check if response has the expected structure
    if (response.data && response.data.token) {
      console.log('Login successful, storing token');
      localStorage.setItem('token', response.data.token);
      
      // Only store user data if it exists
      if (response.data.user) {
        console.log('Storing user data');
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } else {
      console.error('Login response missing token:', response.data);
      throw new Error('Invalid login response format');
    }
  } catch (error) {
    console.error('Login error:', error);
    
    // Provide more detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      
      // Create a more informative error message
      const errorMessage = error.response.data?.message || 'Authentication failed';
      const enhancedError = new Error(errorMessage);
      enhancedError.status = error.response.status;
      enhancedError.data = error.response.data;
      throw enhancedError;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      throw error;
    }
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
};

// Get stored user from localStorage
export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('user'); // Clear invalid data
    return null;
  }
};

// Get stored token from localStorage
export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// For backward compatibility
export const authLogin = login;
export const authLogout = logout;

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

// Resend verification email
export const resendVerificationEmail = async (email) => {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token');
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}; 