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
      // Don't log error for public routes
      const isPublicRoute = publicRoutes.some(route => config.url.includes(route));
      if (!isPublicRoute) {
        console.warn('No token available for request to:', config.url);
      }
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
      console.log('New token received and stored');
    }
    return response;
  },
  async (error) => {
    console.error('API response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
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
          // Clear all auth data but don't redirect - let the AuthContext handle it
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          throw new Error('No refresh token available');
        }
        
        console.log('Attempting to refresh token...');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        if (response.data && response.data.accessToken) {
          // Store the new tokens
          localStorage.setItem('token', response.data.accessToken);
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
          
          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          
          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error('Invalid refresh token response');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens but don't redirect - let the AuthContext handle it
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return Promise.reject(error);
      }
    }
    
    // Handle CORS errors
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error('CORS or network error detected');
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'));
    }
    
    return Promise.reject(error);
  }
);

// Export the api instance
export { api }; 