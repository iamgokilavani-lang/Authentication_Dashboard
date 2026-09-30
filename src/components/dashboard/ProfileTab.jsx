import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Briefcase,
  ShieldCheck,
  Edit3,
  KeyRound,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

export const ProfileTab = ({ onOpenEditProfile, onOpenChangePassword }) => {
  const { currentUser } = useAuth();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile Header Card */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Cover Banner */}
        <div className="profile-cover-banner">
          <div className="profile-cover-mesh" />
        </div>

        {/* Profile Card Body */}
        <div className="profile-card-body">
          <div className="profile-avatar-row">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem' }}>
              <Avatar
                name={currentUser?.name || 'User'}
                style={currentUser?.avatarStyle || 'gradient-aurora'}
                size="xl"
                showStatus={true}
                className="profile-large-avatar"
              />
              <div style={{ paddingBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {currentUser?.name || 'User'}
                  </h1>
                  <Badge variant="primary" icon={<ShieldCheck size={12} />}>
                    Verified Identity
                  </Badge>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {currentUser?.role || 'Engineer'} • {currentUser?.department || 'Platform Engineering'}
                </p>
              </div>
            </div>

            {/* Quick Edit Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', paddingBottom: '0.25rem' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenChangePassword}
                icon={<KeyRound size={14} />}
              >
                Change Password
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenEditProfile}
                icon={<Edit3 size={14} />}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* User Bio */}
          {currentUser?.bio && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem 1.25rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                About Me
              </span>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                {currentUser.bio}
              </p>
            </div>
          )}

          {/* Detailed Info Grid */}
          <div className="profile-info-grid">
            {/* Email */}
            <div className="info-item-box">
              <span className="info-item-label">
                <Mail size={14} /> Work Email
              </span>
              <span className="info-item-val">{currentUser?.email || 'N/A'}</span>
            </div>

            {/* Phone */}
            <div className="info-item-box">
              <span className="info-item-label">
                <Phone size={14} /> Phone Number
              </span>
              <span className="info-item-val">{currentUser?.phone || '+1 (555) 019-2834'}</span>
            </div>

            {/* Location */}
            <div className="info-item-box">
              <span className="info-item-label">
                <MapPin size={14} /> Primary Location
              </span>
              <span className="info-item-val">{currentUser?.location || 'San Francisco, CA, USA'}</span>
            </div>

            {/* Timezone */}
            <div className="info-item-box">
              <span className="info-item-label">
                <Clock size={14} /> Local Timezone
              </span>
              <span className="info-item-val">{currentUser?.timezone || 'PST (UTC-8)'}</span>
            </div>

            {/* Department */}
            <div className="info-item-box">
              <span className="info-item-label">
                <Briefcase size={14} /> Department
              </span>
              <span className="info-item-val">{currentUser?.department || 'Core Engineering'}</span>
            </div>

            {/* Join Date */}
            <div className="info-item-box">
              <span className="info-item-label">
                <Calendar size={14} /> Account Created
              </span>
              <span className="info-item-val">{currentUser?.joinedDate || 'March 2024'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Access Posture Card */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Security & Access Clearance
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Authentication telemetry and policy adherence ratings.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Multi-Factor Auth
              </span>
              <Badge variant={currentUser?.twoFactorEnabled ? 'success' : 'warning'}>
                {currentUser?.twoFactorEnabled ? 'Active (TOTP)' : 'Not Configured'}
              </Badge>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {currentUser?.twoFactorEnabled
                ? 'Protected with 6-digit cryptographic authenticator.'
                : 'Enable 2FA in Security settings to improve score.'}
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Password Health
              </span>
              <Badge variant="success">Strong (100%)</Badge>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Compliant with upper, lower, numeric, and symbol criteria.
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Device Authorization
              </span>
              <Badge variant="primary">{currentUser?.activeSessions?.length || 1} Registered</Badge>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              All devices verified with TLS 1.3 encrypted handshakes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
