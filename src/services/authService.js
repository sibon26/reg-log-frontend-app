import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────── AUTH API ─────────────────────────────────

export const authService = {
  /**
   * Register a new user account.
   */
  signup: async (data) => {
    const response = await apiClient.post('/signup', data);
    return response.data;
  },

  /**
   * Log in with email and password.
   */
  login: async (data) => {
    const response = await apiClient.post('/login', data);
    return response.data;
  },

  /**
   * Log out by revoking the current JWT.
   */
  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },

  /**
   * Get the currently authenticated user's details.
   */
  getMe: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  /**
   * Request a password-reset OTP for the given email.
   */
  forgotPassword: async (email) => {
    const response = await apiClient.post('/forgot-password', { email });
    return response.data;
  },

  /**
   * Verify the OTP sent to the user's email.
   */
  verifyOtp: async (email, otp) => {
    const response = await apiClient.post('/verify-otp', { email, otp });
    return response.data;
  },

  /**
   * Set a new password after OTP verification.
   */
  resetPassword: async (data) => {
    const response = await apiClient.post('/reset-password', data);
    return response.data;
  },
};

// ──────────────────────────── TOKEN HELPERS ───────────────────────────────

export const tokenHelpers = {
  save: (token) => localStorage.setItem('authToken', token),
  get: () => localStorage.getItem('authToken'),
  remove: () => localStorage.removeItem('authToken'),
  isPresent: () => !!localStorage.getItem('authToken'),
};

export default apiClient;
