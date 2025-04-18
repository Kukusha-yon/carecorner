import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Test the API connection and login functionality
 * @returns {Promise<Object>} Test results
 */
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', API_URL);
    
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 5000
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('API test failed:', error);
    return {
      success: false,
      error: error.message,
      details: error.response?.data || 'No response data'
    };
  }
};

export default testApiConnection; 