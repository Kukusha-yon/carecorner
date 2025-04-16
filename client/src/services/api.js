import axios from 'axios';

// Use a hardcoded value for the backend URL
const API_URL = 'https://carecorner-phi.vercel.app/api';

// Define public routes that don't require authentication
const publicRoutes = [
  '/external/stock-data',
  '/external/news',
  '/products/featured',
  '/products/categories',
  '/partners',
  '/featured-products',
  '/new-arrivals'
];

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('API request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params
    });
    
    const token = localStorage.getItem('token');
    console.log('Authentication token:', token ? `Present (${token.slice(0, 10)}...)` : 'Missing');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header');
    } else {
      console.error('No token available for request to:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    console.log('API response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    
    // Check if the response contains a new token
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    return response;
  },
  async (error) => {
    console.error('API response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    const originalRequest = error.config;
    
    // Check if the request URL is a public route
    const isPublicRoute = publicRoutes.some(route => 
      error.config.url.includes(route)
    );
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicRoute) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.error('No refresh token available');
          throw new Error('No refresh token available');
        }
        
        console.log('Attempting to refresh token...');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        if (!response.data || !response.data.accessToken) {
          throw new Error('Invalid refresh token response');
        }
        
        // Save both the new access token and refresh token
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('token', accessToken);
        console.log('New access token saved');
        
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
          console.log('New refresh token saved');
        }
        
        // Update the Authorization header for the retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens on refresh failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        throw new Error('Session expired. Please log in again.');
      }
    }
    
    // For non-public routes with 401 errors, throw a specific error
    if (error.response?.status === 401 && !isPublicRoute) {
      throw new Error('Authentication required');
    }
    
    return Promise.reject(error);
  }
);

export { api }; 