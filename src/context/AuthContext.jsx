import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  STORAGE_KEYS,
  INITIAL_USER,
  INITIAL_ACTIVITIES,
  loadStoredUsers,
  saveStoredUsers,
  loadCurrentUser,
  saveCurrentUser,
  loadRememberMe,
  saveRememberMe,
  loadActivities,
  saveActivities,
} from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser());
  const [users, setUsers] = useState(() => loadStoredUsers());
  const [activities, setActivities] = useState(() => loadActivities());
  const [rememberMeData, setRememberMeData] = useState(() => loadRememberMe());
  const [isLoading, setIsLoading] = useState(false);
  const [simulateSlowNetwork, setSimulateSlowNetwork] = useState(false);
  const [resetVerificationCodes, setResetVerificationCodes] = useState({});

  // Sync users to storage whenever they change
  useEffect(() => {
    saveStoredUsers(users);
  }, [users]);

  // Sync activities to storage
  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  // Sync current user to storage
  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  // Helper delay
  const waitLatency = useCallback(
    (customMs) => {
      const ms = customMs !== undefined ? customMs : simulateSlowNetwork ? 1500 : 550;
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    [simulateSlowNetwork]
  );

  // Add activity log
  const addActivity = useCallback((title, description, type = 'security', badge = 'Audit') => {
    const newActivity = {
      id: 'act_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      title,
      description,
      timestamp: 'Just now',
      type,
      badge,
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);
  }, []);

  // Login
  const login = async (email, password, remember = false) => {
    setIsLoading(true);
    await waitLatency();

    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!matchedUser) {
      setIsLoading(false);
      return {
        success: false,
        error: 'No account found with this email address. Please register or verify the email.',
      };
    }

    if (matchedUser.password !== password) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials or use Forgot Password.',
      };
    }

    // Save remember me preference
    saveRememberMe(remember, remember ? normalizedEmail : '');
    setRememberMeData({ remember, email: remember ? normalizedEmail : '' });

    // Mark current session as active
    const updatedSessions = matchedUser.activeSessions?.map((s) => ({
      ...s,
      isCurrent: s.id === 'sess_1',
    })) || [
      {
        id: 'sess_' + Date.now(),
        device: 'Google Chrome on Windows 11',
        ip: '192.168.1.42',
        location: 'San Francisco, United States',
        isCurrent: true,
        lastActive: 'Active Now',
      },
    ];

    const loggedInUser = {
      ...matchedUser,
      activeSessions: updatedSessions,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
    };

    // Update in user list
    setUsers((prev) =>
      prev.map((u) => (u.id === loggedInUser.id ? loggedInUser : u))
    );
    setCurrentUser(loggedInUser);

    addActivity(
      'Authenticated Successfully',
      `Signed in to account ${loggedInUser.email} from Chrome / Windows 11`,
      'login',
      'Session'
    );

    setIsLoading(false);
    return { success: true, user: loggedInUser };
  };

  // Register
  const register = async ({ name, email, password, role = 'Member', department = 'Engineering' }) => {
    setIsLoading(true);
    await waitLatency();

    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (existing) {
      setIsLoading(false);
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const newUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: role.trim() || 'Software Engineer',
      department: department.trim() || 'Product Engineering',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA, USA',
      timezone: 'Pacific Standard Time (PST - UTC-8)',
      bio: 'New Aurora Platform member ready to build and collaborate.',
      avatarStyle: 'gradient-cyan',
      avatarUrl: '',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      twoFactorEnabled: false,
      emailVerified: true,
      securityScore: 70,
      activeSessions: [
        {
          id: 'sess_' + Date.now(),
          device: 'Google Chrome on Windows 11',
          ip: '192.168.1.42',
          location: 'San Francisco, United States',
          isCurrent: true,
          lastActive: 'Active Now',
        },
      ],
      lastLogin: 'Just now',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    addActivity(
      'New Account Registered',
      `Welcome to Aurora! Account initialized for ${newUser.name} (${newUser.email})`,
      'system',
      'Registration'
    );

    setIsLoading(false);
    return { success: true, user: newUser };
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    await waitLatency(300);
    if (currentUser) {
      addActivity(
        'User Signed Out',
        `Secure session terminated for ${currentUser.email}`,
        'security',
        'Session'
      );
    }
    setCurrentUser(null);
    saveCurrentUser(null);
    setIsLoading(false);
  };

  // Update Profile
  const updateProfile = async (updatedFields) => {
    setIsLoading(true);
    await waitLatency(500);

    if (!currentUser) {
      setIsLoading(false);
      return { success: false, error: 'No active session.' };
    }

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
    };

    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    addActivity(
      'Profile Information Updated',
      'Personal profile attributes and preferences saved successfully',
      'profile',
      'Profile'
    );

    setIsLoading(false);
    return { success: true, user: updatedUser };
  };

  // Change Password
  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    await waitLatency(600);

    if (!currentUser) {
      setIsLoading(false);
      return { success: false, error: 'No active session.' };
    }

    if (currentUser.password !== currentPassword) {
      setIsLoading(false);
      return { success: false, error: 'Current password does not match our records.' };
    }

    if (currentPassword === newPassword) {
      setIsLoading(false);
      return {
        success: false,
        error: 'New password must be different from your current password.',
      };
    }

    const updatedUser = {
      ...currentUser,
      password: newPassword,
      securityScore: Math.min(100, (currentUser.securityScore || 80) + 10),
    };

    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    addActivity(
      'Password Changed',
      'Account credentials updated and password security verified',
      'security',
      'Credentials'
    );

    setIsLoading(false);
    return { success: true };
  };

  // Request Password Reset (Step 1)
  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    await waitLatency(700);

    const normalizedEmail = email.trim().toLowerCase();
    const targetUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!targetUser) {
      setIsLoading(false);
      return {
        success: false,
        error: `No registered account found for "${email}". Check your spelling or create an account.`,
      };
    }

    // Generate a memorable 6-digit mock OTP code
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setResetVerificationCodes((prev) => ({
      ...prev,
      [normalizedEmail]: {
        code: mockCode,
        createdAt: Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000,
      },
    }));

    addActivity(
      'Password Reset Requested',
      `OTP code generated for verification email: ${normalizedEmail}`,
      'security',
      'Reset OTP'
    );

    setIsLoading(false);
    return {
      success: true,
      email: normalizedEmail,
      code: mockCode,
    };
  };

  // Verify Reset Code (Step 2)
  const verifyResetCode = (email, code) => {
    const normalizedEmail = email.trim().toLowerCase();
    const entry = resetVerificationCodes[normalizedEmail];

    if (!entry) {
      return {
        success: false,
        error: 'No active reset request found for this email. Please request a new code.',
      };
    }

    if (Date.now() > entry.expiresAt) {
      return {
        success: false,
        error: 'The verification code has expired. Please request a fresh one.',
      };
    }

    if (entry.code !== code.trim()) {
      return {
        success: false,
        error: 'Incorrect verification code. Please check your simulated code and try again.',
      };
    }

    return { success: true };
  };

  // Reset Password with Code (Step 3)
  const resetPasswordWithCode = async (email, code, newPassword) => {
    setIsLoading(true);
    await waitLatency(800);

    const verification = verifyResetCode(email, code);
    if (!verification.success) {
      setIsLoading(false);
      return verification;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const targetUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!targetUser) {
      setIsLoading(false);
      return { success: false, error: 'User account not found.' };
    }

    const updatedUser = {
      ...targetUser,
      password: newPassword,
    };

    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    // Invalidate code
    setResetVerificationCodes((prev) => {
      const copy = { ...prev };
      delete copy[normalizedEmail];
      return copy;
    });

    addActivity(
      'Password Reset Successfully',
      `Password for ${normalizedEmail} was changed via verified security code`,
      'security',
      'Recovery'
    );

    setIsLoading(false);
    return { success: true };
  };

  // Toggle Two-Factor Authentication
  const toggle2FA = async () => {
    setIsLoading(true);
    await waitLatency(400);

    if (!currentUser) return;
    const newState = !currentUser.twoFactorEnabled;
    const scoreDiff = newState ? 15 : -15;

    const updatedUser = {
      ...currentUser,
      twoFactorEnabled: newState,
      securityScore: Math.min(100, Math.max(40, (currentUser.securityScore || 85) + scoreDiff)),
    };

    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    addActivity(
      newState ? 'Two-Factor Auth Enabled' : 'Two-Factor Auth Disabled',
      newState
        ? 'TOTP Multi-factor authentication activated with backup recovery codes'
        : 'Two-factor protection disabled on account',
      'security',
      '2FA'
    );

    setIsLoading(false);
    return { success: true, enabled: newState };
  };

  // Revoke Session
  const revokeSession = (sessionId) => {
    if (!currentUser) return;
    const remaining = (currentUser.activeSessions || []).filter((s) => s.id !== sessionId);

    const updatedUser = {
      ...currentUser,
      activeSessions: remaining,
    };

    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    addActivity('Active Session Revoked', `Terminated remote access session #${sessionId}`, 'security', 'Device');
  };

  // Reset demo data to pristine state
  const resetToDemoDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

    setUsers([INITIAL_USER]);
    setCurrentUser(INITIAL_USER);
    setActivities(INITIAL_ACTIVITIES);
    setRememberMeData({ remember: false, email: '' });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isLoading,
        users,
        activities,
        rememberMeData,
        simulateSlowNetwork,
        setSimulateSlowNetwork,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        requestPasswordReset,
        verifyResetCode,
        resetPasswordWithCode,
        toggle2FA,
        revokeSession,
        resetToDemoDefaults,
        addActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
