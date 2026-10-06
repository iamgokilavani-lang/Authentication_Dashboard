import React from 'react';

export const Skeleton = ({ width = '100%', height = '1.25rem', borderRadius = 'var(--radius-sm)', className = '', style = {} }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};
