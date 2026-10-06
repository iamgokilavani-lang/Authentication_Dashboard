import React, { forwardRef } from 'react';

export const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      icon = null,
      iconRight = null,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`btn btn-${variant} btn-${size} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            <span>Please wait...</span>
          </>
        ) : (
          <>
            {icon && <span className="btn-icon-left">{icon}</span>}
            {children}
            {iconRight && <span className="btn-icon-right">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
