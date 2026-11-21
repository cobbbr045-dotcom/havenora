import React, { createContext, useContext, useState, useEffect } from 'react';
import { OwnerUser } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: OwnerUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  demoLogin: () => void;
  logout: () => void;
  updateProfile: (fullName: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_OWNER: OwnerUser = {
  id: 'owner-havenora-01',
  username: 'anuj123457',
  email: 'owner@havenora-retreat.com',
  fullName: 'Tenzing Norbu',
  role: 'owner',
  lastLogin: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<OwnerUser | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('demo') === 'true') {
          localStorage.setItem('havenora_owner_session', JSON.stringify(DEMO_OWNER));
          return DEMO_OWNER;
        }
      }
      const stored = localStorage.getItem('havenora_owner_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;

  const login = async (usernameInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial slight delay for realistic auth response
    await new Promise((r) => setTimeout(r, 500));

    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanUsername || !cleanPassword) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    // Strictly validate authorized owner username: anuj123457 (or owner@havenora-retreat.com alias)
    const isValidUsername = cleanUsername === 'anuj123457' || cleanUsername === 'owner@havenora.com' || cleanUsername === 'owner@havenora-retreat.com';
    const isValidPassword = cleanPassword === 'havenora2026';

    if (isValidUsername && isValidPassword) {
      const sessionUser: OwnerUser = {
        ...DEMO_OWNER,
        username: cleanUsername === 'anuj123457' ? 'anuj123457' : DEMO_OWNER.username,
        lastLogin: new Date().toISOString()
      };
      setUser(sessionUser);
      localStorage.setItem('havenora_owner_session', JSON.stringify(sessionUser));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please verify your Owner Username and Password.'
    };
  };

  const demoLogin = () => {
    const sessionUser: OwnerUser = {
      ...DEMO_OWNER,
      lastLogin: new Date().toISOString()
    };
    setUser(sessionUser);
    localStorage.setItem('havenora_owner_session', JSON.stringify(sessionUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('havenora_owner_session');
  };

  const updateProfile = (fullName: string, email: string) => {
    if (user) {
      const updated = { ...user, fullName, email };
      setUser(updated);
      localStorage.setItem('havenora_owner_session', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, demoLogin, logout, updateProfile }}>
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
