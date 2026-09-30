import React, { forwardRef, useId } from 'react';

export const Checkbox = forwardRef(
  ({ label, description, id: customId, className = '', checked, onChange, disabled, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = customId || generatedId;

    return (
      <div className={`checkbox-group ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <label htmlFor={checkboxId} className="checkbox-label">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="checkbox-input"
            {...props}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{label}</span>
            {description && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                {description}
              </span>
            )}
          </div>
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
