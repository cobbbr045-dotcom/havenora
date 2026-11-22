import React, { createContext, useContext, useState, useEffect } from 'react';
import { OwnerUser } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: OwnerUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (fullName: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<OwnerUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verify server-side session cookie on initial load
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setUser({
              id: 'owner-havenora-01',
              username: data.user.username,
              email: `${data.user.username}@havenora.com`,
              fullName: data.user.fullName || 'Tenzing Norbu',
              role: 'owner',
              lastLogin: new Date().toISOString()
            });
          }
        } else {
          // If 401 or not authenticated, clear user
          if (isMounted) setUser(null);
        }
      } catch {
        // Fallback for purely static preview or dev without serverless runtime
        try {
          const stored = localStorage.getItem('havenora_session_fallback');
          if (stored && isMounted) {
            setUser(JSON.parse(stored));
          }
        } catch {
          if (isMounted) setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (usernameInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    const cleanUsername = usernameInput.trim();
    const cleanPassword = passwordInput.trim();

    if (!cleanUsername || !cleanPassword) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    try {
      // Call serverless API with credentials included (cookies)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const authedUser: OwnerUser = {
          id: 'owner-havenora-01',
          username: data.user.username,
          email: `${data.user.username}@havenora.com`,
          fullName: data.user.fullName || 'Tenzing Norbu',
          role: 'owner',
          lastLogin: new Date().toISOString()
        };
        setUser(authedUser);
        localStorage.setItem('havenora_session_fallback', JSON.stringify(authedUser));
        return { success: true };
      }

      // Handle Rate Limiting (429) or Authentication Failure (401)
      if (res.status === 429) {
        return {
          success: false,
          error: data.error || 'Too many failed login attempts. Please wait before retrying.'
        };
      }

      return {
        success: false,
        error: data.error || 'Invalid credentials. Access restricted to authorized owner.'
      };
    } catch {
      return { success: false, error: 'Authentication service unavailable. Please check connection.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // Ignore network errors on logout
    }
    setUser(null);
    localStorage.removeItem('havenora_session_fallback');
    localStorage.removeItem('havenora_owner_session');
  };

  const updateProfile = (fullName: string, email: string) => {
    if (user) {
      const updated = { ...user, fullName, email };
      setUser(updated);
      localStorage.setItem('havenora_session_fallback', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        login,
        logout,
        updateProfile
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
