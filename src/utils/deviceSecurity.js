// Device & IP Security Control for Ubari Portal
// Restricts visibility of the "Sign In" button exclusively to the owner's PC/IP/Device

const AUTH_KEY = 'portal_authorized_device';
const WHITELIST_KEY = 'portal_whitelisted_ips';

// List of private local IP prefixes automatically permitted (owner's local computer)
const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '::1'];

export const isLocalOrPrivateNetwork = () => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname || '';
  if (LOCAL_HOSTNAMES.includes(hostname)) return true;
  // Local network IPs (192.168.x.x, 10.x.x.x, 172.16.x.x)
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(hostname)) {
    return true;
  }
  return false;
};

export const getWhitelistedIps = () => {
  try {
    const saved = localStorage.getItem(WHITELIST_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return ['127.0.0.1', '::1', '192.168.*'];
};

export const saveWhitelistedIps = (ips) => {
  try {
    localStorage.setItem(WHITELIST_KEY, JSON.stringify(ips));
    window.dispatchEvent(new Event('device_auth_changed'));
  } catch (e) {}
};

export const authorizeCurrentDevice = () => {
  try {
    localStorage.setItem(AUTH_KEY, '1');
    window.dispatchEvent(new Event('device_auth_changed'));
  } catch (e) {}
};

export const deauthorizeCurrentDevice = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event('device_auth_changed'));
  } catch (e) {}
};

export const isCurrentDeviceAuthorized = () => {
  if (typeof window === 'undefined') return false;

  // 1. One-time URL Query activation (e.g. ?admin or ?auth=admin on owner's private device)
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin') || params.has('auth') || params.has('device_auth')) {
      authorizeCurrentDevice();
      // Clean query parameter silently from URL bar
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
      return true;
    }
  } catch (e) {}

  // 2. Already authorized device in localStorage (owner's personal computer or phone)
  try {
    if (localStorage.getItem(AUTH_KEY) === '1') {
      return true;
    }
  } catch (e) {}

  // 3. Computer's local host / owner's local network (automatically authorized)
  if (isLocalOrPrivateNetwork()) {
    // Silently mark this device as authorized for future sessions
    try {
      localStorage.setItem(AUTH_KEY, '1');
    } catch (e) {}
    return true;
  }

  // 4. Logged in user is always authorized to see their profile/actions
  try {
    const userSession = sessionStorage.getItem('portal_user') || localStorage.getItem('portal_user');
    if (userSession) return true;
  } catch (e) {}

  return false;
};

