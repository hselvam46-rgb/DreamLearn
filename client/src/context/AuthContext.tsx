import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  loginStudent: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  registerStudent: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dreamlearn_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // Only block with loading spinner if there is a token but no cached user yet
    return !localStorage.getItem('dreamlearn_user') && !!getStoredToken();
  });

  const refreshUser = async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res?.success && res.user) {
        setUser(res.user);
        localStorage.setItem('dreamlearn_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Session refresh note:', err);
      // Never logout on refresh error if user is cached locally
      const saved = localStorage.getItem('dreamlearn_user');
      if (!saved) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const loginStudent = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setStoredToken(res.token);
        localStorage.setItem('dreamlearn_user', JSON.stringify(res.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.adminLogin({ email, password });
      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setStoredToken(res.token);
        localStorage.setItem('dreamlearn_user', JSON.stringify(res.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerStudent = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register({ name, email, password });
      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setStoredToken(res.token);
        localStorage.setItem('dreamlearn_user', JSON.stringify(res.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeStoredToken();
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isStudent = isAuthenticated && user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        isStudent,
        loginStudent,
        loginAdmin,
        registerStudent,
        logout,
        refreshUser,
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
