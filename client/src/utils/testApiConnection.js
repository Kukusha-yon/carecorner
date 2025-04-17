import api from '../services/api';

/**
 * Tests the API connection by making a request to the health endpoint
 * @returns {Promise<boolean>} - The result of the test
 */
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', import.meta.env.VITE_API_URL);
    
    // Test the health endpoint
    const response = await api.get('/health');
    console.log('API connection test successful:', response.data);
    return true;
  } catch (error) {
    console.error('API connection test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return false;
  }
};

export default testApiConnection; 