import api from './api';

// Product categories
export const PRODUCT_CATEGORIES = {
  CISCO_SWITCH: 'CISCO Switch',
  SERVER: 'Server',
  MONITORS: 'Monitors',
  LOGITECH_WORLD: 'Logitech World',
  BAGS: 'Bags',
  CHARGER: 'Charger'
};

export const getProducts = async (params = {}) => {
  try {
    console.log('Fetching products with params:', params);
    const response = await api.get('/products', { params });
    console.log('Products response:', response.data);
    
    // Handle both paginated and non-paginated responses
    const products = response.data.products || response.data;
    const total = response.data.total || products.length;
    
    console.log(`Received ${products.length} products`);
    return { products, total };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    console.log('Fetching product with ID:', id);
    const response = await api.get(`/products/${id}`);
    console.log('Product response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', {
      id,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Create product error:', error);
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update product error:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.delete(`/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Delete product error:', error);
    throw error;
  }
};

export const getBestSellers = async () => {
  const response = await api.get('/products/best-sellers');
  return response.data;
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get('/products/featured');
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch featured products');
  }
};

export const searchProducts = async (query) => {
  console.log('Searching for products with query:', query);
  const response = await api.get('/products/search', { params: { q: query } });
  console.log('Search response:', response.data);
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await api.get(`/products/category/${encodeURIComponent(category)}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
}; 