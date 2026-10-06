import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Check, X, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { PasswordStrengthMeter } from '../common/PasswordStrengthMeter';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { evaluatePassword } from '../../utils/validators';

export const ResetPasswordForm = ({ onNavigate, resetParams = {} }) => {
  const { resetPasswordWithCode, isLoading } = useAuth();
  const { showToast } = useToast();

  const [email] = useState(resetParams.email || 'gokilavani@aurora.io');
  const [code, setCode] = useState(resetParams.code || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!code) {
      newErrors.code = 'Verification code is required.';
    }

    const passEval = evaluatePassword(password);
    if (!passEval.isValid) {
      newErrors.password = 'Password does not satisfy our minimum complexity rules.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm the new password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await resetPasswordWithCode(email, code, password);
    setIsSubmitting(false);

    if (result.success) {
      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      showToast('Password reset successfully! You can now sign in.', 'success', 5000);
      onNavigate('login');
    } else {
      setErrors((prev) => ({ ...prev, form: result.error }));
      showToast(result.error, 'error');
    }
  };

  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  return (
    <form onSubmit={handleSubmit} noValidate className="animate-fade-in">
      {/* Account Verification Summary */}
      <div
        className="glass-panel"
        style={{
          background: 'var(--bg-surface-elevated)',
          padding: '0.875rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} style={{ color: 'var(--color-success)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Resetting Credentials for:
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {email}
            </span>
          </div>
        </div>

        {code && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--accent-primary)',
              background: 'var(--accent-subtle)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Code: {code}
          </span>
        )}
      </div>

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
          <X size={16} />
          <span>{errors.form}</span>
        </div>
      )}

      {/* If code was missing, allow user to input it */}
      {!code && (
        <Input
          label="Verification Code"
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={errors.code}
          required
        />
      )}

      {/* New Password */}
      <Input
        label="New Password"
        type="password"
        placeholder="Enter complex password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
        }}
        icon={<Lock size={18} />}
        error={errors.password}
        autoComplete="new-password"
        required
      />

      <div style={{ marginBottom: '1.25rem', marginTop: '-0.5rem' }}>
        <PasswordStrengthMeter password={password} showRules={true} />
      </div>

      {/* Confirm Password */}
      <div style={{ position: 'relative' }}>
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Repeat new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
          }}
          icon={<Lock size={18} />}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        {passwordsMatch && (
          <div
            style={{
              position: 'absolute',
              top: '2px',
              right: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--color-success)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <Check size={14} /> Passwords match
          </div>
        )}
        {passwordsMismatch && (
          <div
            style={{
              position: 'absolute',
              top: '2px',
              right: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--color-danger)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <X size={14} /> Passwords do not match
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting || isLoading}
        style={{ width: '100%', marginTop: '0.5rem' }}
        iconRight={<ArrowRight size={18} />}
      >
        Save New Password & Sign In
      </Button>

      <div className="auth-footer-prompt">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <ArrowLeft size={16} /> Cancel & Return to Login
        </button>
      </div>
    </form>
  );
};
