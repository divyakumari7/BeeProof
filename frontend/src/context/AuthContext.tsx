import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  getDashboardPathForUser: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (rawUser: any): User => {
  if (!rawUser) return rawUser;
  const role = rawUser.role || rawUser.primaryRole || (Array.isArray(rawUser.roles) && rawUser.roles[0]) || '';
  const roles = Array.isArray(rawUser.roles) && rawUser.roles.length > 0
    ? rawUser.roles
    : (role ? [role] : []);
  return {
    ...rawUser,
    role,
    primaryRole: role,
    roles,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cachedUser = localStorage.getItem('beeproof_user');
      return cachedUser ? normalizeUser(JSON.parse(cachedUser)) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('beeproof_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('beeproof_token');
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          if (res.success && res.data) {
            const normalized = normalizeUser(res.data);
            setUser(normalized);
            localStorage.setItem('beeproof_user', JSON.stringify(normalized));
          }
        } catch (err) {
          console.warn('Stored token invalid or expired, clearing session');
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.login({ username, password });
      if (res.success && res.data) {
        const receivedToken = res.data.token;
        const loggedUser = normalizeUser(res.data.user);

        localStorage.setItem('beeproof_token', receivedToken);
        localStorage.setItem('beeproof_user', JSON.stringify(loggedUser));

        setToken(receivedToken);
        setUser(loggedUser);
        return loggedUser;
      }
      throw new Error(res.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('beeproof_token');
    localStorage.removeItem('beeproof_user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    const userRoles = Array.isArray(user.roles) ? user.roles : (user.role ? [(user as any).role] : []);
    return userRoles.includes(role);
  };

  const getDashboardPathForUser = (): string => {
    if (!user) return '/';
    const userRoles = Array.isArray(user.roles) ? user.roles : (user.role ? [(user as any).role] : []);
    if (userRoles.includes('ADMIN_KVIC')) return '/admin';
    if (userRoles.includes('BEEKEEPER')) return '/beekeeper';
    if (userRoles.includes('PROCESSOR')) return '/processor';
    if (userRoles.includes('QUALITY_LAB')) return '/quality-lab';
    if (userRoles.includes('DISTRIBUTOR')) return '/distributor';
    return '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        hasRole,
        getDashboardPathForUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
