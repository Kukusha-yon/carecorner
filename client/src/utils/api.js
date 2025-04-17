import { api } from '../services/api';

/**
 * API for product-related operations
 */
export const productsAPI = {
  /**
   * Get all products with optional filtering and pagination
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} - Axios response
   */
  getAll: (params) => {
    return api.get('/products', { params });
  },
  
  /**
   * Get a single product by ID
   * @param {string} id - Product ID
   * @returns {Promise} - Axios response
   */
  getById: (id) => {
    return api.get(`/products/${id}`);
  },
  
  /**
   * Create a new product
   * @param {Object} data - Product data
   * @returns {Promise} - Axios response
   */
  create: (data) => {
    return api.post('/products', data);
  },
  
  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} data - Updated product data
   * @returns {Promise} - Axios response
   */
  update: (id, data) => {
    return api.put(`/products/${id}`, data);
  },
  
  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise} - Axios response
   */
  delete: (id) => {
    return api.delete(`/products/${id}`);
  }
}; 