import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If token refresh is in progress, add request to queue
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      
      // Extract tokens correctly from the response
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }
      
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      processQueue(null);
      return api(originalRequest);
    } catch (error) {
      processQueue(error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return null;
    }
    throw new Error(error.response?.data?.message || 'Failed to get user data');
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Store tokens
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Store tokens
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    // Return user data
    return {
      _id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove tokens even if the server request fails
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const changePassword = async (passwordData) => {
  try {
    await api.put('/auth/change-password', passwordData);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send reset email');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh-token', { refreshToken });
    
    // Save the new access token
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    
    // Save the new refresh token if it exists
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data.accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear tokens on refresh failure
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    throw new Error('Session expired. Please log in again.');
  }
};

export default api; 