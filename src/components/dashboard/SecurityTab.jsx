import React, { useState } from 'react';
import {
  KeyRound,
  QrCode,
  Smartphone,
  Laptop,
  Trash2,
  CheckCircle2,
  Lock,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SecurityTab = ({ onOpenChangePassword }) => {
  const { currentUser, toggle2FA, revokeSession, isLoading } = useAuth();
  const { showToast } = useToast();

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const mockSecretKey = 'AURORA-7K9Q-X4P2-M9L1';
  const mockBackupCodes = ['7482-1093', '3910-8472', '9201-4471', '1940-3829'];

  const handleToggle2FA = async () => {
    if (!currentUser?.twoFactorEnabled) {
      // Opening modal to configure
      setShow2FAModal(true);
    } else {
      // Disabling directly with confirmation
      const res = await toggle2FA();
      if (res.success) {
        showToast('Two-Factor Authentication disabled.', 'warning');
      }
    }
  };

  const handleConfirm2FAActivation = async () => {
    const res = await toggle2FA();
    if (res.success) {
      showToast('Two-Factor Authentication is now active! Security score boosted.', 'success');
      setShow2FAModal(false);
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard?.writeText?.(mockSecretKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    showToast('Secret key copied to clipboard!', 'info');
  };

  const handleRevokeSession = (sessionId, deviceName) => {
    revokeSession(sessionId);
    showToast(`Revoked session for ${deviceName}`, 'info');
  };

  const handleRevokeAllOthers = () => {
    const others = (currentUser?.activeSessions || []).filter((s) => !s.isCurrent);
    others.forEach((s) => revokeSession(s.id));
    showToast('All remote sessions terminated successfully.', 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Security Overview Header */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Security & Access Control
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Manage cryptographic passwords, multi-factor authentication, and connected devices.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Security Posture:</span>
            <Badge variant="success" icon={<CheckCircle2 size={12} />}>
              Level 4 Zero-Trust
            </Badge>
          </div>
        </div>
      </div>

      {/* Row 1: Password Management & 2FA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Password Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-subtle)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Account Password
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Last evaluated: Today
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1, marginBottom: '1.25rem' }}>
            Your password is cryptographically checked against entropy requirements. We recommend rotating your credentials periodically.
          </p>

          <Button
            variant="outline"
            onClick={onOpenChangePassword}
            icon={<Lock size={15} />}
            style={{ width: '100%' }}
          >
            Change Account Password
          </Button>
        </div>

        {/* 2FA Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: currentUser?.twoFactorEnabled ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                  color: currentUser?.twoFactorEnabled ? 'var(--color-success)' : 'var(--color-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCode size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Two-Factor Authentication
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  TOTP Authenticator Apps
                </span>
              </div>
            </div>

            <Badge variant={currentUser?.twoFactorEnabled ? 'success' : 'warning'}>
              {currentUser?.twoFactorEnabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1, marginBottom: '1.25rem' }}>
            Adds an extra layer of protection by requiring a 6-digit code from Google Authenticator, Authy, or 1Password when signing in.
          </p>

          <Button
            variant={currentUser?.twoFactorEnabled ? 'danger-outline' : 'primary'}
            onClick={handleToggle2FA}
            isLoading={isLoading}
            style={{ width: '100%' }}
          >
            {currentUser?.twoFactorEnabled ? 'Disable Two-Factor Auth' : 'Setup Two-Factor Auth'}
          </Button>
        </div>
      </div>

      {/* Row 2: Active Sessions Management */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Active Sessions & Device Authorization
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Devices and IP addresses currently authenticated to your Aurora account.
            </p>
          </div>

          {(currentUser?.activeSessions || []).filter((s) => !s.isCurrent).length > 0 && (
            <Button
              variant="danger-outline"
              size="sm"
              onClick={handleRevokeAllOthers}
              icon={<Trash2 size={14} />}
            >
              Terminate Other Sessions
            </Button>
          )}
        </div>

        {/* Sessions List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(currentUser?.activeSessions || []).map((session) => (
            <div key={session.id} className="session-item">
              <div className="session-device-info">
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: session.isCurrent ? 'var(--color-success)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {session.device.toLowerCase().includes('iphone') || session.device.toLowerCase().includes('mobile') ? (
                    <Smartphone size={18} />
                  ) : (
                    <Laptop size={18} />
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {session.device}
                    </span>
                    {session.isCurrent && (
                      <Badge variant="success" size="sm">
                        Current Device
                      </Badge>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>IP: {session.ip}</span>
                    <span>•</span>
                    <span>{session.location}</span>
                    <span>•</span>
                    <span style={{ color: session.isCurrent ? 'var(--color-success)' : 'inherit' }}>
                      {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id, session.device)}
                  style={{ color: 'var(--color-danger)' }}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2FA Setup Modal Dialog */}
      <Modal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Setup Two-Factor Authentication"
        subtitle="Scan this QR code with your authenticator app (Google Authenticator, Authy, or 1Password)."
        maxWidth="500px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShow2FAModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm2FAActivation}>
              Confirm & Activate 2FA
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
          {/* Simulated High-Res QR Code */}
          <div
            style={{
              padding: '1.25rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              display: 'inline-flex',
            }}
          >
            <svg width="150" height="150" viewBox="0 0 100 100" fill="#000000">
              <rect x="0" y="0" width="30" height="30" fill="#0f172a" />
              <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
              <rect x="10" y="10" width="10" height="10" fill="#0f172a" />

              <rect x="70" y="0" width="30" height="30" fill="#0f172a" />
              <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
              <rect x="80" y="10" width="10" height="10" fill="#0f172a" />

              <rect x="0" y="70" width="30" height="30" fill="#0f172a" />
              <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
              <rect x="10" y="80" width="10" height="10" fill="#0f172a" />

              {/* Data modules */}
              <rect x="35" y="5" width="8" height="8" />
              <rect x="50" y="5" width="12" height="8" />
              <rect x="35" y="20" width="15" height="10" />
              <rect x="10" y="40" width="10" height="20" />
              <rect x="30" y="40" width="20" height="20" />
              <rect x="60" y="40" width="15" height="10" />
              <rect x="80" y="40" width="15" height="15" />
              <rect x="40" y="70" width="15" height="15" />
              <rect x="65" y="65" width="25" height="10" />
              <rect x="65" y="80" width="15" height="15" />
            </svg>
          </div>

          {/* Manual Entry Key */}
          <div style={{ width: '100%', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Manual Entry Secret Key
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.85rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                marginTop: '0.35rem',
              }}
            >
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                {mockSecretKey}
              </code>
              <button
                type="button"
                onClick={handleCopySecret}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                }}
              >
                {copiedKey ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Emergency Backup Codes */}
          <div style={{ width: '100%', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Emergency Backup Codes (One-Time Use)
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                marginTop: '0.35rem',
              }}
            >
              {mockBackupCodes.map((c) => (
                <div
                  key={c}
                  style={{
                    padding: '0.35rem 0.5rem',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
