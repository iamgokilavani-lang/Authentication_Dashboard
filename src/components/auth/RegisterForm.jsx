import React, { useState } from 'react';
import { User, Mail, Lock, Check, X, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Checkbox } from '../common/Checkbox';
import { PasswordStrengthMeter } from '../common/PasswordStrengthMeter';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateEmail, validateName, evaluatePassword } from '../../utils/validators';

export const RegisterForm = ({ onNavigate }) => {
  const { register, isLoading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Full Stack Engineer',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const nameResult = validateName(formData.name);
    if (!nameResult.isValid) newErrors.name = nameResult.message;

    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) newErrors.email = emailResult.message;

    const passResult = evaluatePassword(formData.password);
    if (!passResult.isValid) {
      newErrors.password = 'Password does not meet our minimum security criteria.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service to continue.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
    setIsSubmitting(false);

    if (result.success) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.warn('Confetti effect skipped:', err);
      }

      showToast(`Welcome to Aurora, ${result.user.name}! Account ready.`, 'success');
      onNavigate('dashboard');
    } else {
      showToast(result.error, 'error');
      setErrors((prev) => ({ ...prev, form: result.error }));
    }
  };

  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <form onSubmit={handleSubmit} noValidate className="animate-fade-in">
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

      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        placeholder="e.g. Gokilavani"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        icon={<User size={18} />}
        error={errors.name}
        autoComplete="name"
        required
      />

      {/* Email Address */}
      <Input
        label="Work Email Address"
        type="email"
        placeholder="gokilavani@company.com"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        icon={<Mail size={18} />}
        error={errors.email}
        autoComplete="email"
        required
      />

      {/* Role / Job Title */}
      <div className="form-group">
        <label htmlFor="reg-role" className="form-label">
          Primary Role / Title
        </label>
        <div className="input-wrapper">
          <span className="input-prefix-icon">
            <Briefcase size={18} />
          </span>
          <select
            id="reg-role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="form-input has-prefix"
            style={{ appearance: 'auto' }}
          >
            <option value="Full Stack Engineer">Full Stack Engineer</option>
            <option value="Security Architect">Security Architect</option>
            <option value="Cloud Systems Lead">Cloud Systems Lead</option>
            <option value="DevOps & SRE">DevOps & SRE</option>
            <option value="Product Designer">Product Designer</option>
          </select>
        </div>
      </div>

      {/* Password with live strength criteria */}
      <Input
        label="Security Password"
        type="password"
        placeholder="At least 8 chars with symbols"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        icon={<Lock size={18} />}
        error={errors.password}
        autoComplete="new-password"
        required
      />

      {/* Live Strength Meter */}
      <div style={{ marginBottom: '1.25rem', marginTop: '-0.5rem' }}>
        <PasswordStrengthMeter password={formData.password} showRules={true} />
      </div>

      {/* Confirm Password */}
      <div style={{ position: 'relative' }}>
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          icon={<Lock size={18} />}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        {/* Real-time Match Indicator */}
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

      {/* Terms and Privacy Checkbox */}
      <div style={{ marginBottom: '1.5rem', marginTop: '0.25rem' }}>
        <Checkbox
          label={
            <span>
              I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </span>
          }
          checked={formData.agreeTerms}
          onChange={(e) => handleChange('agreeTerms', e.target.checked)}
        />
        {errors.agreeTerms && (
          <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {errors.agreeTerms}
          </p>
        )}
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
        Create Aurora Account
      </Button>

      {/* Switch to Login */}
      <div className="auth-footer-prompt">
        <span>Already have an account?</span>
        <button type="button" onClick={() => onNavigate('login')}>
          Sign In
        </button>
      </div>
    </form>
  );
};
