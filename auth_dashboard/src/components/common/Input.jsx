import React, { forwardRef, useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Input = forwardRef(
  (
    {
      label,
      hint,
      error,
      type = 'text',
      icon = null,
      rightElement = null,
      className = '',
      id: customId,
      autoComplete,
      required = false,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const isPasswordField = type === 'password';
    const [showPassword, setShowPassword] = useState(false);

    const actualType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`form-group ${className}`}>
        {label && (
          <div className="form-label-row">
            <label htmlFor={inputId} className="form-label">
              {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
            </label>
            {hint && <span id={hintId} className="form-hint">{hint}</span>}
          </div>
        )}

        <div className="input-wrapper">
          {icon && <span className="input-prefix-icon">{icon}</span>}

          <input
            ref={ref}
            id={inputId}
            type={actualType}
            autoComplete={autoComplete}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={
              [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
            }
            className={`form-input ${icon ? 'has-prefix' : ''} ${
              isPasswordField || rightElement ? 'has-suffix' : ''
            } ${error ? 'is-error' : ''}`}
            {...props}
          />

          {isPasswordField ? (
            <button
              type="button"
              className="input-suffix-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : (
            rightElement && <div className="input-suffix-element">{rightElement}</div>
          )}
        </div>

        {error && (
          <div id={errorId} className="form-error" role="alert">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
