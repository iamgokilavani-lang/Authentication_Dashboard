/**
 * LocalStorage Persistence and Initial Demo Seed
 */

export const STORAGE_KEYS = {
  USERS: 'aurora_users_v2',
  CURRENT_USER: 'aurora_current_user_v2',
  REMEMBER_ME: 'aurora_remember_me_v2',
  ACTIVITIES: 'aurora_activities_v2',
  THEME: 'aurora_theme_v2',
  ACCENT: 'aurora_accent_v2',
  RESET_TOKENS: 'aurora_reset_tokens_v2',
};

// Initial pre-configured seed user
export const INITIAL_USER = {
  id: 'usr_aurora_001',
  name: 'Gokilavani',
  email: 'gokilavani@aurora.io',
  password: 'Password123!',
  role: 'Principal Cloud Architect',
  department: 'Security & Distributed Systems',
  phone: '+1 (415) 890-4421',
  location: 'San Francisco, CA, USA',
  timezone: 'Pacific Standard Time (PST - UTC-8)',
  bio: 'Architecting zero-trust cloud infrastructure, resilient developer platforms, and high-performance frontend interfaces.',
  avatarStyle: 'gradient-aurora',
  avatarUrl: '',
  joinedDate: 'March 15, 2024',
  twoFactorEnabled: false,
  emailVerified: true,
  securityScore: 85,
  activeSessions: [
    {
      id: 'sess_1',
      device: 'Google Chrome on Windows 11',
      ip: '192.168.1.42',
      location: 'San Francisco, United States',
      isCurrent: true,
      lastActive: 'Active Now',
    },
    {
      id: 'sess_2',
      device: 'Mobile Safari on iPhone 16 Pro',
      ip: '73.189.44.12',
      location: 'San Jose, United States',
      isCurrent: false,
      lastActive: '2 hours ago',
    },
    {
      id: 'sess_3',
      device: 'Brave Browser on macOS Sonoma',
      ip: '198.51.100.8',
      location: 'Oakland, United States',
      isCurrent: false,
      lastActive: '3 days ago',
    },
  ],
};

export const INITIAL_ACTIVITIES = [
  {
    id: 'act_1',
    title: 'Successful Authentication',
    description: 'Signed in from Chrome on Windows 11 (IP: 192.168.1.42)',
    timestamp: 'Just now',
    type: 'login',
    badge: 'Security',
  },
  {
    id: 'act_2',
    title: 'Password Validation Check Passed',
    description: 'Cryptographic policy enforcement verified successfully',
    timestamp: 'Yesterday at 4:15 PM',
    type: 'security',
    badge: 'Audit',
  },
  {
    id: 'act_3',
    title: 'Profile Updated',
    description: 'Updated bio, department and notification preferences',
    timestamp: '3 days ago',
    type: 'profile',
    badge: 'Account',
  },
  {
    id: 'act_4',
    title: 'System Access Provisioned',
    description: 'Aurora enterprise role activated with dual-key authentication',
    timestamp: 'March 15, 2024',
    type: 'system',
    badge: 'System',
  },
];

export const loadStoredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([INITIAL_USER]));
      return [INITIAL_USER];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([INITIAL_USER]));
      return [INITIAL_USER];
    }
    return parsed;
  } catch (e) {
    console.error('Error loading users from localStorage:', e);
    return [INITIAL_USER];
  }
};

export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to localStorage:', e);
  }
};

export const loadCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error loading current user:', e);
    return null;
  }
};

export const saveCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Error saving current user:', e);
  }
};

export const loadRememberMe = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    return raw ? JSON.parse(raw) : { remember: false, email: '' };
  } catch {
    return { remember: false, email: '' };
  }
};

export const saveRememberMe = (remember, email = '') => {
  try {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify({ remember, email: remember ? email : '' }));
  } catch (e) {
    console.error('Error saving remember me:', e);
  }
};

export const loadActivities = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIVITIES;
  }
};

export const saveActivities = (activities) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (e) {
    console.error('Error saving activities:', e);
  }
};
