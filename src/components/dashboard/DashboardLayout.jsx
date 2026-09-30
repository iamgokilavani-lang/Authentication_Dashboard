import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  User,
  KeyRound,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Lock,
  Wifi,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { OverviewTab } from './OverviewTab';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import { SettingsTab } from './SettingsTab';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export const DashboardLayout = ({ onTriggerProtectedSimulation }) => {
  const {
    currentUser,
    logout,
    simulateSlowNetwork,
    setSimulateSlowNetwork,
  } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // overview | profile | security | settings
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security & 2FA', icon: <KeyRound size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    showToast('Securely logging out...', 'info');
    await logout();
  };

  const handleTriggerErrorDemo = () => {
    showToast('Simulated System Alert: Connection failed on replica DB node.', 'error');
  };

  const handleToggleSlowNetwork = () => {
    const next = !simulateSlowNetwork;
    setSimulateSlowNetwork(next);
    showToast(
      next ? 'Simulated Slow Network Enabled (1.5s latency)' : 'Normal Network Latency Restored',
      'info'
    );
  };

  return (
    <div className="dashboard-root">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 35 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'is-open' : ''}`}>
        {/* Sidebar Header Brand */}
        <div className="sidebar-header">
          <div className="auth-brand" onClick={() => setActiveTab('overview')}>
            <div className="auth-brand-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="auth-brand-text">
              <span className="brand-name">Aurora</span>
              <span className="brand-tag">Enterprise Hub</span>
            </div>
          </div>
          {mobileMenuOpen && (
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <span className="nav-section-title">Workspace Navigation</span>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item-btn ${activeTab === item.id ? 'is-active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === 'security' && (
                <span className="nav-item-badge">
                  {currentUser?.twoFactorEnabled ? '2FA' : 'Basic'}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Mini Card at Bottom */}
        <div className="sidebar-footer">
          <div
            className="user-mini-card"
            onClick={() => setActiveTab('profile')}
            title="View personal profile"
          >
            <Avatar
              name={currentUser?.name || 'User'}
              style={currentUser?.avatarStyle || 'gradient-aurora'}
              size="sm"
            />
            <div className="user-mini-info">
              <div className="user-mini-name">{currentUser?.name || 'User'}</div>
              <div className="user-mini-email">{currentUser?.email || 'N/A'}</div>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            <div className="topbar-title-wrap">
              <span className="topbar-breadcrumbs">
                Aurora Dashboard / <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{activeTab}</span>
              </span>
              <h1 className="topbar-title" style={{ textTransform: 'capitalize' }}>
                {activeTab === 'security' ? 'Security & 2FA Access' : activeTab}
              </h1>
            </div>
          </div>

          <div className="topbar-right">
            {/* Demo Simulator Toolbar Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {/* Simulate Protected Route Interception */}
              <button
                type="button"
                className="demo-pill-btn"
                onClick={onTriggerProtectedSimulation}
                title="Test protected route redirection when unauthenticated"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                <Lock size={13} />
                <span>Simulate Route Guard</span>
              </button>

              {/* Simulate Slow Network */}
              <button
                type="button"
                className="topbar-icon-btn"
                onClick={handleToggleSlowNetwork}
                title={simulateSlowNetwork ? 'Disable Slow Network Simulation' : 'Simulate Slow Latency (1.5s)'}
                style={{
                  color: simulateSlowNetwork ? 'var(--color-warning)' : 'var(--text-secondary)',
                  borderColor: simulateSlowNetwork ? 'var(--color-warning)' : 'var(--border-subtle)',
                }}
              >
                <Wifi size={17} />
              </button>

              {/* Simulate Error Notification */}
              <button
                type="button"
                className="topbar-icon-btn"
                onClick={handleTriggerErrorDemo}
                title="Simulate Error Notification"
              >
                <AlertCircle size={17} />
              </button>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              className="topbar-icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications Bell with simulated popover */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="topbar-icon-btn"
                onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
                aria-label="View notifications"
              >
                <Bell size={18} />
                <span className="notification-unread-dot" />
              </button>

              {showNotificationsMenu && (
                <div
                  className="dropdown-menu-popover"
                  style={{ width: '310px' }}
                  onClick={() => setShowNotificationsMenu(false)}
                >
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Security Alerts
                    </span>
                    <Badge variant="primary" size="sm">2 New</Badge>
                  </div>
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        Session Token Renewed
                      </p>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        TLS Handshake verified from Chrome (Windows 11) • Just now
                      </span>
                    </div>
                    <div style={{ padding: '0.75rem 1rem' }}>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        Policy Compliance Score
                      </p>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        Account posture reached 85% compliance • 2h ago
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <Avatar
                  name={currentUser?.name || 'User'}
                  style={currentUser?.avatarStyle || 'gradient-aurora'}
                  size="sm"
                />
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {showUserDropdown && (
                <div
                  className="dropdown-menu-popover"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <strong style={{ fontSize: '0.875rem', display: 'block', color: 'var(--text-primary)' }}>
                      {currentUser?.name || 'User'}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentUser?.email}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User size={15} />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <User size={15} />
                    <span>Edit Profile Details</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => setIsChangePasswordOpen(true)}
                  >
                    <KeyRound size={15} />
                    <span>Change Password</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings size={15} />
                    <span>Preferences & Settings</span>
                  </button>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.25rem 0' }} />

                  <button
                    type="button"
                    className="dropdown-item is-danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <main className="dashboard-content-area">
          {activeTab === 'overview' && (
            <OverviewTab
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onOpenChangePassword={() => setIsChangePasswordOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onOpenChangePassword={() => setIsChangePasswordOpen(true)}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              onOpenChangePassword={() => setIsChangePasswordOpen(true)}
            />
          )}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>

      {/* Global Modals for Profile Editing & Password Changing */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};
