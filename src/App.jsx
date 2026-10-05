import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import './index.css';
import './styles/auth.css';
import './styles/dashboard.css';


const BookingDashboardRedirect = () => {
  useEffect(() => {
    window.location.replace('/booking/dashboard.html#dashboard');
  }, []);

  return (
    <div className="app-root" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <p>Opening booking dashboard…</p>
    </div>
  );
};

const MainApp = () => {
  const { isAuthenticated } = useAuth();

  // Screen router: authentication screens plus the protected booking dashboard handoff.
  const [currentScreen, setCurrentScreen] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['login', 'register', 'forgot', 'reset'].includes(hash)) {
      return hash;
    }
    return isAuthenticated ? 'booking' : 'login';
  });

  const [resetParams, setResetParams] = useState({
    email: 'gokilavani@aurora.io',
    code: '',
  });

  // Keep URL hash synchronized for deep-linking & refreshing
  useEffect(() => {
    if (currentScreen !== 'booking') {
      window.location.hash = currentScreen;
    }
  }, [currentScreen]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['login', 'register', 'forgot', 'reset'].includes(hash)) {
        setCurrentScreen(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // When auth changes
  useEffect(() => {
    if (isAuthenticated && currentScreen === 'login') {
      setCurrentScreen('booking');
    }
  }, [isAuthenticated, currentScreen]);

  const handleNavigate = (screen, params = null) => {
    if (params) {
      setResetParams(params);
    }
    setCurrentScreen(screen);
  };

  // After successful authentication, hand off to the protected booking dashboard.
  if (currentScreen === 'booking' || currentScreen === 'dashboard') {
    return (
      <ProtectedRoute onRedirectToLogin={() => setCurrentScreen('login')}>
        <BookingDashboardRedirect />
      </ProtectedRoute>
    );
  }

  // Auth Screens
  return (
    <div className="app-root">
      {currentScreen === 'login' && (
        <AuthLayout
          title="Sign In to Aurora"
          subtitle="Enter your verified credentials to access your protected workspace."
          activeScreen="login"
          onNavigate={handleNavigate}
        >
          <LoginForm onNavigate={handleNavigate} />
        </AuthLayout>
      )}

      {currentScreen === 'register' && (
        <AuthLayout
          title="Create an Account"
          subtitle="Join Aurora Enterprise to build, deploy, and monitor zero-trust systems."
          activeScreen="register"
          onNavigate={handleNavigate}
        >
          <RegisterForm onNavigate={handleNavigate} />
        </AuthLayout>
      )}

      {currentScreen === 'forgot' && (
        <AuthLayout
          title="Account Recovery"
          subtitle="Verify your identity with a cryptographic code to reset your password."
          activeScreen="forgot"
          onNavigate={handleNavigate}
        >
          <ForgotPasswordForm
            onNavigate={handleNavigate}
            onCodeGenerated={(email, code) => setResetParams({ email, code })}
          />
        </AuthLayout>
      )}

      {currentScreen === 'reset' && (
        <AuthLayout
          title="Set New Password"
          subtitle="Choose a complex, secure password to finalize account recovery."
          activeScreen="reset"
          onNavigate={handleNavigate}
        >
          <ResetPasswordForm
            onNavigate={handleNavigate}
            resetParams={resetParams}
          />
        </AuthLayout>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
