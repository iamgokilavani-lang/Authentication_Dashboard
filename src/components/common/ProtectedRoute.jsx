import React, { useEffect, useState } from 'react';
import { ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProtectedRoute = ({ children, onRedirectToLogin }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer;
    if (!isAuthenticated) {
      showToast('Protected Route: Authentication required. Redirecting...', 'warning', 3000);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAuthenticated, showToast]);

  useEffect(() => {
    if (!isAuthenticated && countdown === 0) {
      onRedirectToLogin();
    }
  }, [countdown, isAuthenticated, onRedirectToLogin]);

  if (!isAuthenticated) {
    return (
      <div
        className="app-root"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          minHeight: '100vh',
          background: 'var(--bg-main)',
        }}
      >
        <div
          className="glass-panel animate-scale-up"
          style={{
            maxWidth: '480px',
            width: '100%',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            borderColor: 'var(--color-warning-border)',
            boxShadow: '0 12px 35px rgba(245, 158, 11, 0.15)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-warning-bg)',
              color: 'var(--color-warning)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <ShieldAlert size={32} />
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Protected Route Shield Active
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            You attempted to access a protected workspace route (<strong>/dashboard</strong>) without an active cryptographic session. Zero-trust enforcement has intercepted this request.
          </p>

          <div
            style={{
              padding: '0.75rem',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <RefreshCw size={14} className="spinner" />
            <span>Redirecting to authentication portal in {countdown}s...</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={onRedirectToLogin}
            iconRight={<ArrowRight size={18} />}
            style={{ width: '100%' }}
          >
            Sign In Now
          </Button>
        </div>
      </div>
    );
  }

  return children;
};
