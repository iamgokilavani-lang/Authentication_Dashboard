/**
 * Form and Security Validation Utilities
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email address is required.' };
  }
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { isValid: false, message: 'Email address is required.' };
  }
  // Standard RFC 5322 compliant regex for practical email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address (e.g. user@example.com).' };
  }
  return { isValid: true, message: '' };
};

export const evaluatePassword = (password = '') => {
  const criteria = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'At least one uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'At least one lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', label: 'At least one number (0-9)', met: /[0-9]/.test(password) },
    { id: 'special', label: 'At least one special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = criteria.filter((c) => c.met).length;
  let strength = 'none';
  let score = 0;
  let label = 'Very Weak';
  let color = 'var(--color-danger)';

  if (password.length === 0) {
    strength = 'none';
    score = 0;
    label = 'Enter a password';
    color = 'var(--text-muted)';
  } else if (metCount <= 2) {
    strength = 'weak';
    score = 25;
    label = 'Weak';
    color = 'var(--color-danger)';
  } else if (metCount === 3) {
    strength = 'fair';
    score = 50;
    label = 'Fair';
    color = 'var(--color-warning)';
  } else if (metCount === 4) {
    strength = 'good';
    score = 75;
    label = 'Good';
    color = 'var(--color-info)';
  } else if (metCount === 5) {
    strength = 'strong';
    score = 100;
    label = 'Strong & Secure';
    color = 'var(--color-success)';
  }

  const isValid = metCount >= 4 && password.length >= 8;

  return {
    criteria,
    metCount,
    strength,
    score,
    label,
    color,
    isValid,
  };
};

export const validateName = (name) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return { isValid: false, message: 'Full name is required.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters.' };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { isValid: false, message: 'Name should only contain letters, spaces, hyphens, or apostrophes.' };
  }
  return { isValid: true, message: '' };
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return { isValid: true, message: '' }; // optional
  const cleaned = phone.replace(/[\s().\-+]/g, '');
  if (!/^[0-9]{7,15}$/.test(cleaned)) {
    return { isValid: false, message: 'Please enter a valid phone number with 7 to 15 digits.' };
  }
  return { isValid: true, message: '' };
};
