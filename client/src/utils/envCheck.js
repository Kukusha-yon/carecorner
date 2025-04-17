/**
 * Utility function to check environment variables
 * This should only be used for debugging purposes
 */
export const checkEnvironmentVariables = () => {
  const envVars = {
    NODE_ENV: import.meta.env.NODE_ENV,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
  };

  console.log('Environment Variables Check:');
  console.table(envVars);

  // Check if API URL is properly set
  if (!envVars.VITE_API_URL && envVars.PROD) {
    console.error('WARNING: VITE_API_URL is not set in production environment!');
    return false;
  }

  return true;
};

export default checkEnvironmentVariables; 