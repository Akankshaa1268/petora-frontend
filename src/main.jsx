import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Simple loading component
function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '3px solid rgba(255,255,255,0.3)',
        borderTop: '3px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <h2 style={{ margin: '0 0 10px', fontSize: '24px' }}>Petora</h2>
      <p style={{ margin: 0, opacity: 0.8 }}>Loading healthcare AI...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Error fallback component
function ErrorScreen({ error }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h2 style={{ margin: '0 0 20px', fontSize: '24px' }}>Petora</h2>
      <p style={{ margin: '0 0 20px', opacity: 0.8 }}>Something went wrong while loading the application.</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '12px 24px',
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Refresh Page
      </button>
      {error && (
        <details style={{ marginTop: '20px', opacity: 0.7, fontSize: '12px' }}>
          <summary>Error Details</summary>
          <pre style={{ textAlign: 'left', maxWidth: '500px', overflow: 'auto' }}>
            {error.toString()}
          </pre>
        </details>
      )}
    </div>
  )
}

// App wrapper with error handling
function AppWrapper() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Show loading for just 300ms to prevent flash
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return <ErrorScreen error={error} />
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  )
}

// Create root with error handling
try {
  const root = createRoot(document.getElementById('root'))
  root.render(<AppWrapper />)
} catch (error) {
  console.error('Failed to render app:', error)
  // Fallback rendering
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 20px;
        font-family: Arial, sans-serif;
      ">
        <h2>Petora</h2>
        <p>Failed to load the application. Please check your browser console for errors.</p>
        <button onclick="window.location.reload()" style="
          padding: 12px 24px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-size: 16px;
        ">
          Refresh Page
        </button>
      </div>
    `
  }
}
