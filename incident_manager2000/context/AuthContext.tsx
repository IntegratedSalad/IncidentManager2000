'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export interface User {
  name: string;
  email: string;
  roles?: string[];
  provider?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  roles: string[];
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  login: (provider: 'microsoft') => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  const user = session?.user ? {
    name: session.user.name || '',
    email: session.user.email || '',
    roles: session.user.roles || [],
  } : null;

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const isAdmin = roles.includes('Admin');

  // Helper function to check if user has a specific role
  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  // Przechowywanie tokenu dostępu i ról w stanie aplikacji
  useEffect(() => {
    console.log('[AuthContext] ===== SESSION UPDATE =====');
    console.log('[AuthContext] Session status:', status);
    console.log('[AuthContext] Session user:', session?.user);
    
    if (session?.accessToken) {
      console.log('[AuthContext] ✓ Found session.accessToken, length:', session.accessToken.length);
      setAccessToken(session.accessToken);
      localStorage.setItem('accessToken', session.accessToken);
    } else if (session?.idToken) {
      console.log('[AuthContext] ✓ Found session.idToken, using as accessToken, length:', session.idToken.length);
      setAccessToken(session.idToken);
      localStorage.setItem('accessToken', session.idToken);
    } else if (!session) {
      console.log('[AuthContext] Clearing accessToken - no session');
      setAccessToken(null);
      localStorage.removeItem('accessToken');
    } else {
      console.warn('[AuthContext] ⚠ NO TOKEN in session!');
      console.log('[AuthContext] Session keys:', Object.keys(session || {}));
      setAccessToken(null);
    }

    if (session?.user?.roles) {
      console.log('[AuthContext] ✓ Setting roles from session.user.roles:', session.user.roles);
      setRoles(session.user.roles as string[]);
      localStorage.setItem('userRoles', JSON.stringify(session.user.roles));
    } else if (session?.roles) {
      console.log('[AuthContext] ✓ Setting roles from session.roles:', session.roles);
      setRoles(session.roles as string[]);
      localStorage.setItem('userRoles', JSON.stringify(session.roles));
    } else if (!session) {
      console.log('[AuthContext] Clearing roles - no session');
      setRoles([]);
      localStorage.removeItem('userRoles');
    } else {
      console.warn('[AuthContext] ⚠ NO ROLES in session');
      setRoles([]);
    }
    console.log('[AuthContext] ===== END SESSION UPDATE =====');
  }, [session]);

  const login = async (provider: 'microsoft') => {
    try {
      const result = await signIn(provider, { redirect: false });
      if (result?.error) {
        console.error('Login error:', result.error);
      } else if (result?.ok) {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const logout = async () => {
    try {
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const fetchUser = async () => {
    // NextAuth handles this automatically through useSession
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error: null, accessToken, roles, hasRole, isAdmin, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
