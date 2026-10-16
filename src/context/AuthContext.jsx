import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, tokenHelpers } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (tokenHelpers.isPresent()) {
        try {
          const res = await authService.getMe();
          if (res.success) setUser(res.data);
        } catch {
          tokenHelpers.remove();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = useCallback((token, userData) => {
    tokenHelpers.save(token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Token may already be invalid – still clear local state
    }
    tokenHelpers.remove();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
