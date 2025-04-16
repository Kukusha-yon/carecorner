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
          // Don't redirect immediately, let the component handle it
          return Promise.reject(error);
        }
        
        console.log('Attempting to refresh token...');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        // Save both the new access token and refresh token
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        if (accessToken) {
          localStorage.setItem('token', accessToken);
          console.log('New access token saved');
        }
        
        // Save the new refresh token if it exists
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
          console.log('New refresh token saved');
        }
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh token fails, clear tokens but don't redirect immediately
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }
    
    // Only redirect to login for non-public routes if it's a 401 error
    if (error.response?.status === 401 && !isPublicRoute) {
      // Don't redirect immediately, let the component handle it
      console.error('Authentication error:', error.response?.data?.message || 'Unauthorized');
    }
    
    return Promise.reject(error);
  }
);

export { api }; 