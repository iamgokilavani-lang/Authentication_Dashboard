/**
 * Shared authentication guard for the booking dashboard.
 * The authentication UI stores the active demo session in localStorage.
 * This guard prevents direct dashboard access without that session.
 */
(function () {
  const CURRENT_USER_KEY = 'aurora_current_user_v2';

  function readCurrentUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Unable to read authentication session:', error);
      return null;
    }
  }

  const currentUser = readCurrentUser();

  if (!currentUser || !currentUser.email) {
    window.location.replace('/#login');
    return;
  }

  window.portalSession = {
    user: currentUser,
    logout() {
      localStorage.removeItem(CURRENT_USER_KEY);
      window.location.replace('/#login');
    },
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-session-user-name]').forEach(function (element) {
      element.textContent = currentUser.name || currentUser.email;
    });

    document.querySelectorAll('[data-session-user-role]').forEach(function (element) {
      element.textContent = currentUser.role || 'Authenticated User';
    });
  });
})();
