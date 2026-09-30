import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon = <Inbox size={38} />,
  title = 'No items found',
  description = 'There is currently no data or activity to display here.',
  actionLabel = null,
  onAction = null,
  className = '',
}) => {
  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-subtle)',
          color: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>

      <div style={{ maxWidth: '380px' }}>
        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          {title}
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
