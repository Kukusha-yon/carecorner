/**
 * Utility function to check environment variables
 * This should only be used for debugging purposes
 */
export const checkEnvironmentVariables = () => {
  const requiredVars = [
    'VITE_API_URL',
    'VITE_APP_NAME',
    'VITE_APP_DESCRIPTION',
    'VITE_APP_VERSION'
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    return false;
  }

  console.log('Environment variables check passed:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    NODE_ENV: import.meta.env.MODE
  });

  return true;
}; 