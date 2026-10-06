import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Award,
  Clock,
  Plus,
  CheckCircle2,
  User,
  KeyRound,
  RotateCw,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { Skeleton } from '../common/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const OverviewTab = ({ onOpenEditProfile, onOpenChangePassword, onNavigateTab }) => {
  const { currentUser, activities, addActivity } = useAuth();
  const { showToast } = useToast();

  const [filterType, setFilterType] = useState('all');
  const [showEmptyDemo, setShowEmptyDemo] = useState(false);
  const [showSkeletonDemo, setShowSkeletonDemo] = useState(false);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const currentDateString = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }, []);

  const handleAddSampleActivity = () => {
    const samples = [
      { title: 'API Key Rotated', desc: 'Generated fresh secret key for Production Cluster', type: 'security', badge: 'Audit' },
      { title: '2FA Verification Code Generated', desc: 'Temporary one-time passcode requested for access verification', type: 'login', badge: 'Auth' },
      { title: 'Profile Bio Refined', desc: 'Updated professional focus and department listing', type: 'profile', badge: 'Account' },
      { title: 'Security Audit Completed', desc: 'Zero high-risk vulnerabilities discovered in active session telemetry', type: 'security', badge: 'Security' },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    addActivity(picked.title, picked.desc, picked.type, picked.badge);
    showToast('New activity logged to timeline!', 'info');
  };

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'all') return true;
    return act.type === filterType;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, var(--bg-surface-glass) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Badge variant="primary" icon={<ShieldCheck size={12} />}>
              Aurora Platform
            </Badge>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              • {currentDateString}
            </span>
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {greeting}, {currentUser?.name || 'User'}!
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            All systems verified. Your authentication posture is operating in optimal health.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSkeletonDemo(!showSkeletonDemo)}
            icon={<RotateCw size={14} />}
          >
            {showSkeletonDemo ? 'Hide Skeletons' : 'Test Skeletons'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmptyDemo(!showEmptyDemo)}
          >
            {showEmptyDemo ? 'Restore Timeline' : 'Test Empty State'}
          </Button>
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
            icon={<User size={14} />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      {showSkeletonDemo ? (
        <div className="metrics-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card metric-card">
              <div style={{ width: '70%' }}>
                <Skeleton width="60%" height="0.875rem" />
                <Skeleton width="90%" height="2rem" style={{ margin: '0.5rem 0' }} />
                <Skeleton width="50%" height="0.75rem" />
              </div>
              <Skeleton width="44px" height="44px" borderRadius="var(--radius-md)" />
            </div>
          ))}
        </div>
      ) : (
        <div className="metrics-grid">
          {/* Security Score */}
          <div className="glass-card metric-card">
            <div className="metric-info">
              <span className="metric-label">Security Score</span>
              <span className="metric-value" style={{ color: 'var(--color-success)' }}>
                {currentUser?.securityScore || 85}%
              </span>
              <span className="metric-subtext">
                <CheckCircle2 size={13} color="var(--color-success)" />
                {currentUser?.twoFactorEnabled ? '2FA Enabled (+15%)' : 'Standard 1-Factor'}
              </span>
            </div>
            <div
              className="metric-icon-wrap"
              style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}
            >
              <ShieldCheck size={22} />
            </div>
          </div>

          {/* Active Sessions */}
          <div
            className="glass-card metric-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onNavigateTab('security')}
          >
            <div className="metric-info">
              <span className="metric-label">Active Sessions</span>
              <span className="metric-value">
                {currentUser?.activeSessions?.length || 1}
              </span>
              <span className="metric-subtext">
                <Smartphone size={13} color="var(--accent-primary)" />
                Current device + remote
              </span>
            </div>
            <div
              className="metric-icon-wrap"
              style={{ background: 'var(--accent-subtle)', color: 'var(--accent-primary)' }}
            >
              <Smartphone size={22} />
            </div>
          </div>

          {/* Account Role */}
          <div
            className="glass-card metric-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onNavigateTab('profile')}
          >
            <div className="metric-info">
              <span className="metric-label">Account Tier</span>
              <span
                className="metric-value"
                style={{ fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                Enterprise
              </span>
              <span className="metric-subtext">
                <Award size={13} color="var(--color-warning)" />
                {currentUser?.role || 'Staff Member'}
              </span>
            </div>
            <div
              className="metric-icon-wrap"
              style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}
            >
              <Award size={22} />
            </div>
          </div>

          {/* Last Login */}
          <div className="glass-card metric-card">
            <div className="metric-info">
              <span className="metric-label">Last Active</span>
              <span className="metric-value" style={{ fontSize: '1.25rem' }}>
                {currentUser?.lastLogin || 'Just now'}
              </span>
              <span className="metric-subtext">
                <Clock size={13} color="var(--color-info)" />
                Encrypted session
              </span>
            </div>
            <div
              className="metric-icon-wrap"
              style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}
            >
              <Clock size={22} />
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Activity Timeline and Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.75rem' }}>
        {/* Activity Timeline Card */}
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
                Security & Authentication Activity Log
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Auditable event history persisted across your browser sessions.
              </p>
            </div>

            {/* Filter pills & Add sample button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {['all', 'security', 'login', 'profile'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilterType(type)}
                    style={{
                      background: filterType === type ? 'var(--accent-primary)' : 'transparent',
                      color: filterType === type ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddSampleActivity}
                icon={<Plus size={14} />}
              >
                Add Event
              </Button>
            </div>
          </div>

          {/* Timeline Content */}
          {showEmptyDemo || filteredActivities.length === 0 ? (
            <EmptyState
              title="No Activity Events Recorded"
              description="There are currently no recorded authentication or security events matching this filter."
              actionLabel="Generate Simulated Event"
              onAction={handleAddSampleActivity}
            />
          ) : (
            <div className="timeline-list">
              {filteredActivities.map((act) => {
                let icon = <ShieldCheck size={16} />;
                let iconBg = 'var(--color-success-bg)';
                let iconColor = 'var(--color-success)';

                if (act.type === 'login') {
                  icon = <KeyRound size={16} />;
                  iconBg = 'var(--accent-subtle)';
                  iconColor = 'var(--accent-primary)';
                } else if (act.type === 'profile') {
                  icon = <User size={16} />;
                  iconBg = 'var(--color-info-bg)';
                  iconColor = 'var(--color-info)';
                }

                return (
                  <div key={act.id} className="timeline-item">
                    <div
                      className="timeline-icon-wrap"
                      style={{ background: iconBg, color: iconColor }}
                    >
                      {icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {act.title}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {act.timestamp}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        {act.description}
                      </p>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {act.badge || 'Audit'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
