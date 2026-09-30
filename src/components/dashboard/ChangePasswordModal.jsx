import React, { useState } from 'react';
import { Lock, Check, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { PasswordStrengthMeter } from '../common/PasswordStrengthMeter';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { evaluatePassword } from '../../utils/validators';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { changePassword, isLoading } = useAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'You must enter your current password.';
    }

    const passEval = evaluatePassword(newPassword);
    if (!passEval.isValid) {
      newErrors.newPassword = 'New password does not satisfy our complexity requirements.';
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'New password cannot be identical to your current password.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please repeat the new password.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (result.success) {
      showToast('Password changed successfully! Security score updated.', 'success');
      resetForm();
      onClose();
    } else {
      setErrors((prev) => ({ ...prev, currentPassword: result.error }));
      showToast(result.error, 'error');
    }
  };

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword && newPassword !== confirmPassword;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Change Account Password"
      subtitle="Safeguard your account with a high-entropy, cryptographically strong password."
      maxWidth="500px"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting || isLoading}
          >
            Update Password
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Current Password */}
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: '' }));
          }}
          icon={<Lock size={18} />}
          error={errors.currentPassword}
          autoComplete="current-password"
          required
        />

        {/* New Password */}
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new strong password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }));
          }}
          icon={<Lock size={18} />}
          error={errors.newPassword}
          autoComplete="new-password"
          required
        />

        <div style={{ marginBottom: '1.25rem', marginTop: '-0.5rem' }}>
          <PasswordStrengthMeter password={newPassword} showRules={true} />
        </div>

        {/* Confirm New Password */}
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
      </form>
    </Modal>
  );
};
