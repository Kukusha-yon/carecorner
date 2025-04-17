import axios from 'axios';

/**
 * Tests if the API is accessible
 * @returns {Promise<Object>} - The result of the test
 */
export const testApi = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD ? 'https://carecorner-phi.vercel.app/api' : 'http://localhost:5001/api');
  
  console.log('Testing API at:', apiUrl);
  
  try {
    // Test the root endpoint
    const rootResponse = await axios.get('https://carecorner-phi.vercel.app/', {
      timeout: 5000
    });
    console.log('Root endpoint response:', rootResponse.data);
    
    // Test the health endpoint
    const healthResponse = await axios.get(`${apiUrl}/health`, {
      timeout: 5000
    });
    console.log('Health endpoint response:', healthResponse.data);
    
    return {
      success: true,
      rootResponse: rootResponse.data,
      healthResponse: healthResponse.data
    };
  } catch (error) {
    console.error('API test failed:', error);
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

export default testApi; 