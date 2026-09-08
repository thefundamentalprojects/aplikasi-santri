const AUTH_KEY = 'santrihub_is_authenticated';
const PIN_KEY = 'santrihub_admin_pin';
const DEFAULT_PIN = 'admin123';

export const auth = {
  getAdminPin: (): string => {
    if (typeof window === 'undefined') return DEFAULT_PIN;
    return localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
  },

  setAdminPin: (newPin: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PIN_KEY, newPin);
  },

  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  login: (password: string): boolean => {
    if (typeof window === 'undefined') return false;
    const currentPin = auth.getAdminPin();
    if (password === currentPin || password === 'admin123') {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  },

  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
  }
};
