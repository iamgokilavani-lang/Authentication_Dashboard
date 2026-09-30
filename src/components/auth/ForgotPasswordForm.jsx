import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, KeyRound, Copy, Check } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateEmail } from '../../utils/validators';

export const ForgotPasswordForm = ({ onNavigate, onCodeGenerated }) => {
  const { requestPasswordReset, verifyResetCode, isLoading } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Request Email, 2: Enter Verification Code
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core logic for requesting a reset code (used by both form submit and resend button)
  const doRequestCode = async () => {
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      setErrors({ email: emailResult.message });
      return;
    }

    setIsSubmitting(true);
    const result = await requestPasswordReset(email);
    setIsSubmitting(false);

    if (result.success) {
      setGeneratedCode(result.code);
      setStep(2);
      setErrors({});
      showToast(`Verification code sent! Simulated code: ${result.code}`, 'info', 6000);
      if (onCodeGenerated) {
        onCodeGenerated(result.email, result.code);
      }
    } else {
      setErrors({ email: result.error });
      showToast(result.error, 'error');
    }
  };

  // Step 1: Request Code (form submit handler)
  const handleRequestCode = async (e) => {
    e.preventDefault();
    await doRequestCode();
  };

  // Step 2: Verify Code and Proceed
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      setErrors({ code: 'Please enter the complete 6-digit verification code.' });
      return;
    }

    const verification = verifyResetCode(email, code);
    if (verification.success) {
      showToast('Code verified! Set your new password.', 'success');
      onNavigate('reset', { email, code });
    } else {
      setErrors({ code: verification.error });
      showToast(verification.error, 'error');
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      setCode(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Code inserted into input!', 'info');
    }
  };

  return (
    <div className="animate-fade-in">
      {step === 1 ? (
        <form onSubmit={handleRequestCode} noValidate>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Enter your account email below. We'll send a 6-digit cryptographic security code to verify your identity.
          </p>

          <Input
            label="Account Email"
            type="email"
            placeholder="gokilavani@aurora.io"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({});
            }}
            icon={<Mail size={18} />}
            error={errors.email}
            autoComplete="email"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting || isLoading}
            style={{ width: '100%', marginTop: '0.5rem' }}
            iconRight={<ArrowRight size={18} />}
          >
            Send Verification Code
          </Button>

          <div className="auth-footer-prompt">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} noValidate>
          {/* Simulated Code Helper Banner */}
          <div
            className="glass-panel"
            style={{
              borderColor: 'var(--accent-border)',
              background: 'var(--accent-subtle)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={18} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Simulated Code:
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: 'var(--accent-primary)',
                }}
              >
                {generatedCode}
              </span>
            </div>

            <div style={{ marginTop: '0.65rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCopyCode}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Filled!' : 'Fill Code'}</span>
              </button>
            </div>
          </div>

          <Input
            label="6-Digit Verification Code"
            type="text"
            placeholder="839201"
            value={code}
            maxLength={6}
            onChange={(e) => {
              setCode(e.target.value.replace(/[^0-9]/g, ''));
              if (errors.code) setErrors({});
            }}
            icon={<ShieldCheck size={18} />}
            error={errors.code}
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', fontSize: '1.1rem' }}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting || isLoading}
            style={{ width: '100%', marginTop: '0.5rem' }}
            iconRight={<ArrowRight size={18} />}
          >
            Verify & Proceed to Reset
          </Button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1.25rem',
              fontSize: '0.85rem',
            }}
          >
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Change Email
            </button>
            <button
              type="button"
              onClick={doRequestCode}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Resend Code
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
