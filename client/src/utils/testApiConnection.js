import axios from 'axios';

/**
 * Tests the API connection by making a request to the products endpoint
 * @param {string} apiUrl - The API URL to test
 * @returns {Promise<Object>} - The result of the test
 */
const testApiConnection = async (apiUrl) => {
  try {
    console.log('Testing API connection to:', apiUrl);
    
    // Test the products endpoint instead of health
    const response = await axios.get(`${apiUrl}/products`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API connection test successful:', response.data);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('API connection test failed:', error);
    
    return {
      success: false,
      error: {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      }
    };
  }
};

export default testApiConnection; 