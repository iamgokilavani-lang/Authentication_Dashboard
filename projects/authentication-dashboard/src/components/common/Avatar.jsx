import React from 'react';
import { AVATAR_PRESETS } from '../../utils/presets';
export { AVATAR_PRESETS };

export const Avatar = ({
  name = 'User',
  style = 'gradient-aurora',
  src = '',
  size = 'md',
  showStatus = true,
  className = '',
}) => {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizePixels = {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 88,
  }[size] || 48;

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1.125rem',
    lg: '1.5rem',
    xl: '2rem',
  }[size] || '1.125rem';

  return (
    <div
      className={`avatar-wrap ${className}`}
      style={{ width: `${sizePixels}px`, height: `${sizePixels}px` }}
    >
      <div
        className={`avatar-circle ${style || 'gradient-aurora'}`}
        style={{
          width: '100%',
          height: '100%',
          fontSize,
        }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {showStatus && <span className="avatar-online-dot" title="Active now" />}
    </div>
  );
};
