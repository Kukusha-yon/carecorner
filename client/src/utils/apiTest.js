import axios from 'axios';

/**
 * Tests if the API is accessible
 * @returns {Promise<Object>} - The result of the test
 */
export const testApi = async () => {
  // Use a direct API URL that bypasses the frontend
  const apiUrl = 'https://carecorner-bl2n-9thaviglq-yonatans-projects-2f1159da.vercel.app/api';
  
  console.log('Testing API at:', apiUrl);
  
  try {
    // Test the health endpoint with proper headers
    const healthResponse = await axios.get(`${apiUrl}/health`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: false // Set to false to avoid CORS issues
    });
    
    console.log('Health endpoint response:', healthResponse.data);
    
    return {
      success: true,
      healthResponse: healthResponse.data,
      apiUrl
    };
  } catch (error) {
    console.error('API test failed:', error);
    
    // Provide more detailed error information
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    };
    
    return {
      success: false,
      error: errorDetails,
      apiUrl
    };
  }
};

export default testApi; 