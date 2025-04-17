import { useState, useEffect } from 'react';
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
        <button 
          onClick={runTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Test Result:</h3>
          <p className="mb-2">
            Status: <span className={testResult.success ? "text-green-600" : "text-red-600"}>
              {testResult.success ? "Success" : "Failed"}
            </span>
          </p>
          
          {testResult.success ? (
            <div>
              <p className="font-semibold">Response Data:</p>
              <pre className="bg-gray-200 p-2 rounded mt-1 overflow-auto max-h-60">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <p className="font-semibold">Error Details:</p>
              <p className="text-red-600">{testResult.error}</p>
              {testResult.details && (
                <pre className="bg-gray-200 p-2 rounded mt-1 overflow-auto max-h-60">
                  {JSON.stringify(testResult.details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTest; 