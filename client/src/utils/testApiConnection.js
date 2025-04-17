import axios from 'axios';

/**
 * Tests the API connection by making a request to the health endpoint
 * @param {string} apiUrl - The API URL to test
 * @returns {Promise<Object>} - The response from the API
 */
export const testApiConnection = async (apiUrl) => {
  try {
    console.log(`Testing API connection to: ${apiUrl}`);
    const response = await axios.get(`${apiUrl}/health`, {
      timeout: 5000
    });
    console.log('API connection test successful:', response.data);
    return {
      success: true,
      data: response.data,
      status: response.status
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