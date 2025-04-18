import React, { useState, useEffect } from 'react';
import { testApiConnection } from '../utils/apiTest';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testApiConnection();
      setTestResult(result);
    } catch (err) {
      setError(err.message);
      console.error('Test error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <div className="mb-4">
        <p className="font-semibold">API URL: {testResult?.apiUrl || 'Loading...'}</p>
        <p className="font-semibold">Environment: {testResult?.environment || 'Loading...'}</p>
      </div>
      
      {loading && <p className="text-blue-500">Running tests...</p>}
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          
          {testResult.tests?.apiAccessible && (
            <div className="mb-4 p-3 border rounded">
              <h4 className="font-semibold">API Accessibility Test:</h4>
              {testResult.tests.apiAccessible.success ? (
                <div className="text-green-600">
                  <p>✅ API is accessible</p>
                  <p>Status: {testResult.tests.apiAccessible.status}</p>
                  <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-auto">
                    {JSON.stringify(testResult.tests.apiAccessible.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-red-600">
                  <p>❌ API is not accessible</p>
                  <p>Error: {testResult.tests.apiAccessible.error}</p>
                  {testResult.tests.apiAccessible.response && (
                    <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-auto">
                      {JSON.stringify(testResult.tests.apiAccessible.response, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
          
          {testResult.tests?.loginEndpoint && (
            <div className="mb-4 p-3 border rounded">
              <h4 className="font-semibold">Login Endpoint Test:</h4>
              {testResult.tests.loginEndpoint.success ? (
                <div className="text-green-600">
                  <p>✅ Login endpoint is accessible</p>
                  <p>Status: {testResult.tests.loginEndpoint.status}</p>
                  <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-auto">
                    {JSON.stringify(testResult.tests.loginEndpoint.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-red-600">
                  <p>❌ Login endpoint error</p>
                  <p>Status: {testResult.tests.loginEndpoint.status}</p>
                  <p>Error: {testResult.tests.loginEndpoint.error}</p>
                  {testResult.tests.loginEndpoint.response && (
                    <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-auto">
                      {JSON.stringify(testResult.tests.loginEndpoint.response, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={runTest}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Tests Again'}
      </button>
    </div>
  );
};

export default ApiTest; 