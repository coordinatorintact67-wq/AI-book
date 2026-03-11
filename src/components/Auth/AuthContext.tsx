import React, { useState, createContext, useContext, useEffect } from 'react';
import type { User } from 'better-auth';

// Backend API URL
const API_URL = 'http://localhost:8000/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: UserData) => Promise<void>;
  signOut: () => Promise<void>;
}

interface UserData {
  roboticsBackground: string;
  softwareExperience: string;
  hardwareExperience: string;
  learningGoals: string;
  educationLevel: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const session = localStorage.getItem('auth.session');
    if (session) {
      try {
        const userData = JSON.parse(session);
        setUser(userData);
      } catch (e) {
        localStorage.removeItem('auth.session');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.message || 'Sign in failed');
    }

    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('auth.session', JSON.stringify(data.user));
  };

  const signUp = async (email: string, password: string, userData: UserData) => {
    const response = await fetch(`${API_URL}/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        name: email.split('@')[0],
        ...userData
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.message || 'Sign up failed');
    }

    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('auth.session', JSON.stringify(data.user));
  };

  const signOut = async () => {
    await fetch(`${API_URL}/sign-out`, {
      method: 'POST',
    });
    setUser(null);
    localStorage.removeItem('auth.session');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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
