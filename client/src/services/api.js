import axios from 'axios';

// Get the API URL from environment variables, with fallbacks
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://carecorner-phi.vercel.app/api' : 'http://localhost:5001/api');

console.log('API URL:', API_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

// Define public routes that don't require authentication
const publicRoutes = [
  '/external/stock-data',
  '/external/news',
  '/products/featured',
  '/products/categories',
  '/featured-products',
  '/partners',
  '/api/featured-products',
  '/api/new-arrivals',
  '/products',
  '/new-arrivals'
];

// Helper function to check if a route is public
const isPublicRoute = (url) => {
  return publicRoutes.some(route => url.includes(route));
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent hanging requests
  timeout: 10000
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
    
    // Only add token for non-public routes
    if (token && !isPublicRoute(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header');
    } else if (!isPublicRoute(config.url)) {
      console.log('No token available for protected route:', config.url);
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
    
    // Check if the response is HTML instead of JSON
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('Received HTML instead of JSON from API:', response.config.url);
      return Promise.reject(new Error('API returned HTML instead of JSON. This usually means the API endpoint is not available.'));
    }
    
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
          throw new Error('No refresh token available');
        }
        
        console.log('Attempting to refresh token...');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });
        console.log('Token refresh response:', response.data);
        
        // Save both the new access token and refresh token
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('token', accessToken);
        
        // Save the new refresh token if it exists
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Only redirect to login for non-public routes
    if (error.response?.status === 401 && !isPublicRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export { api }; 