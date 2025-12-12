'use client';
import React, { createContext, useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export interface User {
  name: string;
  email: string;
  provider?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (provider: 'microsoft') => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user = session?.user ? {
    name: session.user.name || '',
    email: session.user.email || '',
  } : null;

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const login = async (provider: 'microsoft') => {
    try {
      // signIn will handle redirect automatically
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
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const fetchUser = async () => {
    // NextAuth handles this automatically through useSession
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error: null, login, logout, fetchUser }}>
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
