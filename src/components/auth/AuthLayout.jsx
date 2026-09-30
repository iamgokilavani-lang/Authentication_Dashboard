import React from 'react';
import { ShieldCheck, Sparkles, Moon, Sun, Lock, KeyRound, Cpu, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AuthLayout = ({
  children,
  title,
  subtitle,
  activeScreen = 'login',
  onNavigate,
  onFillDemo,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="auth-page-container">
      {/* Dynamic Background Glow Orbs */}
      <div className="ambient-orb ambient-orb-1" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-2" aria-hidden="true" />

      {/* Top Bar with Brand & Theme Toggle */}
      <header className="auth-header-bar">
        <div className="auth-brand" onClick={() => onNavigate('login')} role="button" tabIndex={0}>
          <div className="auth-brand-icon">
            <ShieldCheck size={22} className="brand-shield" />
          </div>
          <div className="auth-brand-text">
            <span className="brand-name">Aurora</span>
            <span className="brand-tag">Security Cloud</span>
          </div>
        </div>

        <div className="auth-top-actions">
          {onFillDemo && (
            <button
              type="button"
              className="demo-pill-btn"
              onClick={onFillDemo}
              title="Quick fill demo credentials for testing"
            >
              <KeyRound size={14} />
              <span>Fill Demo Credentials</span>
            </button>
          )}

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Auth Grid */}
      <div className="auth-main-wrapper">
        <div className="auth-card-wrapper animate-scale-up">
          {/* Card Header */}
          <div className="auth-card-header">
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>

          {/* Form Content */}
          <div className="auth-card-body">{children}</div>
        </div>

        {/* Side Showcase Column (Desktop) */}
        <aside className="auth-showcase-sidebar">
          <div className="showcase-content">
            <div className="showcase-badge">
              <Sparkles size={14} />
              <span>Enterprise Grade Security</span>
            </div>

            <h2 className="showcase-heading">
              Intelligent Identity & Multi-Factor Access Platform
            </h2>

            <p className="showcase-desc">
              Experience modern authentication built with zero-trust principles, real-time cryptographic validation, and persistent dashboard controls.
            </p>

            <div className="showcase-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <Lock size={16} />
                </div>
                <div>
                  <strong>Protected Route Simulation</strong>
                  <p>Guards private dashboards with automatic auth validation.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Cpu size={16} />
                </div>
                <div>
                  <strong>Live Strength Telemetry</strong>
                  <p>Real-time regex complexity scoring and rule enforcement.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong>Session Persistence</strong>
                  <p>Local state, remember me tokens, and simulated device controls.</p>
                </div>
              </div>
            </div>

            {/* Testimonial / Trust note */}
            <div className="showcase-footer-card">
              <div className="footer-avatar">GK</div>
              <div>
                <p className="footer-quote">
                  "Streamlined our identity workflows with zero auth friction."
                </p>
                <span className="footer-author">Gokilavani — Principal Architect</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Screen Navigation Quick Switcher for Testing */}
      <nav className="auth-screen-switcher" aria-label="Demo screens navigation">
        <span className="switcher-label">Demo Screens:</span>
        <button
          type="button"
          className={`switcher-tab ${activeScreen === 'login' ? 'is-active' : ''}`}
          onClick={() => onNavigate('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={`switcher-tab ${activeScreen === 'register' ? 'is-active' : ''}`}
          onClick={() => onNavigate('register')}
        >
          Register
        </button>
        <button
          type="button"
          className={`switcher-tab ${activeScreen === 'forgot' ? 'is-active' : ''}`}
          onClick={() => onNavigate('forgot')}
        >
          Forgot Password
        </button>
        <button
          type="button"
          className={`switcher-tab ${activeScreen === 'reset' ? 'is-active' : ''}`}
          onClick={() => onNavigate('reset')}
        >
          Reset Password
        </button>
      </nav>
    </div>
  );
};
