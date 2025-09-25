import React, { useState } from 'react';
import apiService from '../services/apiService';

const ModelTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const connection = await apiService.testConnection();
      setResult(connection);
      console.log('API Test Result:', connection);
    } catch (err) {
      setError(err.message);
      console.error('API Test Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testModelList = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const models = await apiService.listModels();
      setResult(models);
      console.log('Models List:', models);
    } catch (err) {
      setError(err.message);
      console.error('Models List Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧪 Model Integration Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAPI}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>
        
        <button 
          onClick={testModelList}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'List Available Models'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '5px',
          color: '#dc2626',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '5px',
          color: '#166534'
        }}>
          <h3>Result:</h3>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            fontSize: '12px',
            backgroundColor: '#f9fafb',
            padding: '10px',
            borderRadius: '3px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#6b7280' }}>
        <h4>Next Steps:</h4>
        <ul>
          <li>✅ API Connection Test - Check if backend is running</li>
          <li>✅ Model List Test - Verify your models are detected</li>
          <li>🔄 Upload an image to test predictions</li>
          <li>🔄 Check browser console for detailed logs</li>
        </ul>
      </div>
    </div>
  );
};

export default ModelTest;

