import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Checkbox } from '../common/Checkbox';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateEmail } from '../../utils/validators';

export const LoginForm = ({ onNavigate }) => {
  const { login, isLoading, rememberMeData } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepopulate email if rememberMe was active
  useEffect(() => {
    if (rememberMeData?.remember && rememberMeData?.email) {
      setEmail(rememberMeData.email);
      setRememberMe(true);
    }
  }, [rememberMeData]);

  const handleFillDemo = (type = 'admin') => {
    if (type === 'admin') {
      setEmail('gokilavani@aurora.io');
      setPassword('Password123!');
      setRememberMe(true);
    } else {
      setEmail('dev.sarah@aurora.io');
      setPassword('SecurePass2026!');
      setRememberMe(false);
    }
    setErrors({});
    showToast(`Filled ${type === 'admin' ? 'Gokilavani (Admin)' : 'Dev'} credentials`, 'info');
  };

  const validate = () => {
    const newErrors = {};
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.message;
    }
    if (!password) {
      newErrors.password = 'Password is required to authenticate.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      onNavigate('booking');
    } else {
      showToast(result.error, 'error');
      setErrors((prev) => ({ ...prev, form: result.error }));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="animate-fade-in">
      {/* Demo Credentials Fast-Fill Toolbar */}
      <div className="quick-fill-box">
        <div className="quick-fill-info">
          <span className="quick-fill-title">Quick Demo Login</span>
          <span className="quick-fill-creds">gokilavani@aurora.io</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFillDemo('admin')}
            icon={<UserCheck size={14} />}
          >
            Fill Demo
          </Button>
        </div>
      </div>

      {/* Global Form Error Banner */}
      {errors.form && (
        <div
          className="glass-panel"
          style={{
            borderColor: 'var(--color-danger-border)',
            background: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          role="alert"
        >
          <ShieldCheck size={16} />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        placeholder="gokilavani@aurora.io"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
        icon={<Mail size={18} />}
        error={errors.email}
        autoComplete="email"
        required
      />

      {/* Password Input with Show/Hide Password */}
      <Input
        label="Password"
        type="password"
        placeholder="••••••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
        }}
        icon={<Lock size={18} />}
        error={errors.password}
        autoComplete="current-password"
        required
      />

      {/* Remember Me and Forgot Password Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          marginTop: '-0.25rem',
          fontSize: '0.875rem',
        }}
      >
        <Checkbox
          label="Remember me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <button
          type="button"
          onClick={() => onNavigate('forgot')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting || isLoading}
        style={{ width: '100%' }}
        iconRight={<ArrowRight size={18} />}
      >
        Sign In to Aurora
      </Button>

      {/* Switch to Registration */}
      <div className="auth-footer-prompt">
        <span>Don't have an account yet?</span>
        <button type="button" onClick={() => onNavigate('register')}>
          Create Account
        </button>
      </div>
    </form>
  );
};
