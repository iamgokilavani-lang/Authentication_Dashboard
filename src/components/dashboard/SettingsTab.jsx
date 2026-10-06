import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Laptop,
  Bell,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Checkbox } from '../common/Checkbox';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SettingsTab = () => {
  const { theme, setTheme, accent, setAccent, accents } = useTheme();
  const { resetToDemoDefaults, logout } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState({
    securityAlerts: true,
    productUpdates: false,
    sessionWarnings: true,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleNotification = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast('Notification preferences updated.', 'info');
      return updated;
    });
  };

  const handleResetDefaults = () => {
    resetToDemoDefaults();
    showToast('Demo environment restored to initial factory settings!', 'success');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') {
      showToast('Please type DELETE to confirm account destruction.', 'error');
      return;
    }
    setIsDeleting(true);
    setTimeout(async () => {
      resetToDemoDefaults();
      setIsDeleting(false);
      setShowDeleteModal(false);
      showToast('Account erased. Redirecting to login.', 'warning');
      await logout();
    }, 800);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          System Preferences & Configuration
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Personalize workspace aesthetics, manage alerts, and control persistent application storage.
        </p>
      </div>

      {/* Appearance & Themes */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <Palette size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Appearance & Interface Theme
          </h3>
        </div>

        {/* Theme mode selection cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {/* Dark Mode */}
          <div
            onClick={() => setTheme('dark')}
            className={`glass-card ${theme === 'dark' ? 'is-active' : ''}`}
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              border: theme === 'dark' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: '#0d1117',
              color: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Moon size={20} />
              {theme === 'dark' && <Check size={18} color="var(--accent-primary)" strokeWidth={3} />}
            </div>
            <div>
              <strong style={{ fontSize: '0.9375rem', display: 'block' }}>Dark Mode</strong>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>High contrast obsidian palette</span>
            </div>
          </div>

          {/* Light Mode */}
          <div
            onClick={() => setTheme('light')}
            className={`glass-card ${theme === 'light' ? 'is-active' : ''}`}
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              border: theme === 'light' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: '#ffffff',
              color: '#0f172a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Sun size={20} color="#f59e0b" />
              {theme === 'light' && <Check size={18} color="var(--accent-primary)" strokeWidth={3} />}
            </div>
            <div>
              <strong style={{ fontSize: '0.9375rem', display: 'block' }}>Light Mode</strong>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Clean and luminous canvas</span>
            </div>
          </div>

          {/* System Mode */}
          <div
            onClick={() => setTheme('system')}
            className={`glass-card ${theme === 'system' ? 'is-active' : ''}`}
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              border: theme === 'system' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: 'var(--bg-surface-elevated)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Laptop size={20} />
              {theme === 'system' && <Check size={18} color="var(--accent-primary)" strokeWidth={3} />}
            </div>
            <div>
              <strong style={{ fontSize: '0.9375rem', display: 'block' }}>System Sync</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Follow OS system setting</span>
            </div>
          </div>
        </div>

        {/* Dynamic Accent Color Palette */}
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
            Accent Glow Palette
          </span>
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            {accents.map((acc) => {
              const isSelected = accent === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccent(acc.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    background: isSelected ? acc.color : 'var(--bg-surface-elevated)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    border: isSelected ? `2px solid ${acc.color}` : '1px solid var(--border-medium)',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? `0 0 14px ${acc.glow}` : 'none',
                  }}
                >
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: acc.color,
                      border: isSelected ? '2px solid #ffffff' : 'none',
                    }}
                  />
                  <span>{acc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <Bell size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Notification & Security Advisory Triggers
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <Checkbox
            label="Real-Time Security Alerts"
            description="Receive immediate alerts for new sign-ins or password modifications."
            checked={notifications.securityAlerts}
            onChange={() => handleToggleNotification('securityAlerts')}
          />
          <Checkbox
            label="Session Inactivity Warnings"
            description="Prompt before automatic token expiration when idle."
            checked={notifications.sessionWarnings}
            onChange={() => handleToggleNotification('sessionWarnings')}
          />
          <Checkbox
            label="Weekly Telemetry Digest"
            description="Receive encrypted summary of all access audits and security metrics."
            checked={notifications.productUpdates}
            onChange={() => handleToggleNotification('productUpdates')}
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem',
          borderColor: 'var(--color-danger-border)',
          background: 'var(--color-danger-bg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <ShieldAlert size={20} style={{ color: 'var(--color-danger)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-danger)' }}>
            Danger Zone
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          These destructive actions allow testing account recovery, resetting local test fixtures, or completely wiping browser persistence.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            onClick={handleResetDefaults}
            icon={<RotateCcw size={15} />}
          >
            Reset Demo Data to Factory State
          </Button>

          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            icon={<Trash2 size={15} />}
          >
            Delete Account Permanently
          </Button>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setDeleteConfirmationText('');
          setShowDeleteModal(false);
        }}
        title="Confirm Account Deletion"
        subtitle="This action is irreversible. All local tokens, credentials, and sessions will be destroyed."
        maxWidth="460px"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteConfirmationText('');
                setShowDeleteModal(false);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              disabled={deleteConfirmationText !== 'DELETE'}
            >
              Delete Account
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--color-danger-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-danger-border)',
              color: 'var(--color-danger)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={18} />
            <span>Type <strong>DELETE</strong> in all caps to confirm.</span>
          </div>

          <Input
            label="Confirmation"
            type="text"
            placeholder="DELETE"
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
};
