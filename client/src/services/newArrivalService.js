import { api } from './api';

const API_URL = '/api/new-arrivals';

// Get all new arrivals
export const getNewArrivals = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw error;
  }
};

// Get a single new arrival by ID
export const getNewArrival = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching new arrival:', error);
    throw error;
  }
};

// Get all new arrivals for admin
export const getAdminNewArrivals = async () => {
  try {
    console.log('Fetching admin new arrivals...');
    const response = await api.get(`${API_URL}/admin`);
    console.log('Admin new arrivals response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin new arrivals:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    throw error.response?.data || error.message;
  }
};

// Create a new arrival
export const createNewArrival = async (formData) => {
  try {
    const response = await api.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating new arrival:', error);
    throw error;
  }
};

// Update a new arrival
export const updateNewArrival = async (id, formData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating new arrival:', error);
    throw error;
  }
};

// Delete a new arrival
export const deleteNewArrival = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting new arrival:', error);
    throw error;
  }
}; 