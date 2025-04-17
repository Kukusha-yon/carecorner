import api from './api';

/**
 * Checks if the API is available and responding correctly
 * @returns {Promise<boolean>} True if the API is healthy, false otherwise
 */
const checkApiHealth = async () => {
  try {
    console.log('Checking API health...');
    const response = await api.get('/health');
    console.log('API health check response:', response.data);
    
    // Check if the response indicates the API is healthy
    return response.data?.status === 'ok';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default checkApiHealth; 