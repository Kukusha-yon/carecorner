import axios from 'axios';

/**
 * Tests the API connection by making a simple request to the health endpoint
 * @returns {Promise<Object>} The result of the API test
 */
export const testApiConnection = async () => {
  try {
    // Get the API URL from environment variables or use a default
    const apiUrl = import.meta.env.VITE_API_URL || 
      (import.meta.env.PROD ? 'https://carecorner-phi.vercel.app/api' : 'http://localhost:5001/api');
    
    console.log('Testing API connection to:', apiUrl);
    
    // Try to access the health endpoint
    const healthResponse = await axios.get(`${apiUrl}/health`, {
      timeout: 5000
    });
    
    console.log('Health response:', healthResponse.data);
    
    return {
      success: true,
      data: healthResponse.data
    };
  } catch (error) {
    console.error('API connection test failed:', error.message);
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
};

export default testApiConnection; 