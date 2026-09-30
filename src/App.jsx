import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import './index.css';
import './styles/auth.css';
import './styles/dashboard.css';

const MainApp = () => {
  const { isAuthenticated } = useAuth();

  // Screen router: 'login' | 'register' | 'forgot' | 'reset' | 'dashboard'
  const [currentScreen, setCurrentScreen] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['login', 'register', 'forgot', 'reset', 'dashboard'].includes(hash)) {
      return hash;
    }
    return isAuthenticated ? 'dashboard' : 'login';
  });

  const [resetParams, setResetParams] = useState({
    email: 'gokilavani@aurora.io',
    code: '',
  });

  // Keep URL hash synchronized for deep-linking & refreshing
  useEffect(() => {
    window.location.hash = currentScreen;
  }, [currentScreen]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['login', 'register', 'forgot', 'reset', 'dashboard'].includes(hash)) {
        setCurrentScreen(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // When auth changes
  useEffect(() => {
    if (isAuthenticated && currentScreen === 'login') {
      setCurrentScreen('dashboard');
    }
  }, [isAuthenticated, currentScreen]);

  const handleNavigate = (screen, params = null) => {
    if (params) {
      setResetParams(params);
    }
    setCurrentScreen(screen);
  };

  // If active screen is dashboard, render protected view
  if (currentScreen === 'dashboard') {
    return (
      <ProtectedRoute onRedirectToLogin={() => setCurrentScreen('login')}>
        <DashboardLayout
          onTriggerProtectedSimulation={() => {
            // Simulate unauthenticated route interception
            setCurrentScreen('login');
          }}
        />
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
