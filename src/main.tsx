import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorInfo } from 'react'
import App from './App.tsx'
import './index.css'

// Global error handler for unhandled promises and errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  if (event.error?.message?.includes('lov')) {
    console.error('Detected React Three Fiber property error - this is likely due to undefined props being passed to Three.js components');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen bg-cosmic-deep-indigo/95 flex items-center justify-center">
    <div className="bg-cosmic-indigo/80 p-8 rounded-lg border border-cosmic-gold/30 max-w-2xl">
      <h2 className="text-2xl font-serif text-cosmic-gold mb-4">Something went wrong</h2>
      <p className="text-cosmic-silver mb-4">
        The application encountered an error. This might be related to WebGL or Three.js initialization.
      </p>
      <div className="bg-black/50 p-4 rounded overflow-auto max-h-48 text-sm text-red-400 mb-4">
        <pre>{error.message}</pre>
        {error.stack && (
          <details className="mt-2">
            <summary className="cursor-pointer text-red-300">Stack trace</summary>
            <pre className="mt-2 text-xs">{error.stack}</pre>
          </details>
        )}
      </div>
      <button 
        onClick={resetErrorBoundary}
        className="bg-cosmic-gold text-cosmic-deep-indigo px-4 py-2 rounded hover:bg-cosmic-gold/80 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
)

// Error logging function
const logError = (error: Error, errorInfo: ErrorInfo) => {
  console.error('React Error Boundary caught an error:', error, errorInfo);
  
  // Check for specific React Three Fiber errors
  if (error.message?.includes('lov') || error.stack?.includes('applyProps')) {
    console.error('This appears to be a React Three Fiber property application error');
    console.error('This usually happens when undefined props are passed to Three.js components');
  }
};

// Create root with comprehensive error boundary
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there's a div with id='root' in your HTML.");
}

createRoot(rootElement).render(
  <ErrorBoundary 
    FallbackComponent={ErrorFallback}
    onError={logError}
    onReset={() => window.location.reload()}
  >
    <App />
  </ErrorBoundary>
)
