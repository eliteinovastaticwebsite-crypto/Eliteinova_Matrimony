// src/components/EnvTest.jsx
import React, { useEffect } from 'react';

const EnvTest = () => {
  useEffect(() => {
    console.log('🔍 Environment Variables Check:');
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('VITE_APP_NAME:', import.meta.env.VITE_APP_NAME);
    console.log('VITE_APP_ENV:', import.meta.env.VITE_APP_ENV);
    console.log('All env vars:', import.meta.env);
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <h3>Environment Variables</h3>
      <p>VITE_API_URL: {import.meta.env.VITE_API_URL || 'Not set'}</p>
      <p>VITE_APP_NAME: {import.meta.env.VITE_APP_NAME || 'Not set'}</p>
      <p>VITE_APP_ENV: {import.meta.env.VITE_APP_ENV || 'Not set'}</p>
    </div>
  );
};

export default EnvTest;