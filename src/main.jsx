import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Portal Crash Shield] Caught component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#06080E',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'Tajawal, sans-serif',
          direction: 'rtl'
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '32px',
            borderRadius: '24px',
            backgroundColor: '#0c1222',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '28px'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', marginBottom: '8px' }}>
              مشروع طريق أوباري – غات الاستراتيجي
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
              يتم الآن تحديث وتجهيز بيانات المتابعة الميدانية للبوابة. يرجى النقر على زر إعادة التحميل للمتابعة.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                backgroundColor: '#f59e0b',
                color: '#000000',
                fontWeight: '900',
                padding: '12px 28px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              إعادة تحميل البوابة ⟳
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function mountApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('root');
      if (el) {
        ReactDOM.createRoot(el).render(
          <React.StrictMode>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </React.StrictMode>
        );
      }
    });
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
