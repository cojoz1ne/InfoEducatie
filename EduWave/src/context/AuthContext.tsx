'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  is_approved: boolean;
  avatar_url: string;
  is_ai_blacklisted?: boolean;
};

type AuthContextType = {
  user: Profile | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isApproved: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfile(data.user); // In this setup, user and profile are the same
      } else {
        if (res.status === 403) {
          const data = await res.json().catch(() => ({}));
          if (data.message) {
            window.location.href = `/login?error=suspended&message=${encodeURIComponent(data.message)}`;
            return;
          }
        }
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isTeacher = profile?.role === 'teacher';
  const isStudent = profile?.role === 'student';
  const isApproved = profile?.is_approved ?? false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isAdmin, 
      isTeacher, 
      isStudent, 
      isApproved, 
      signOut, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
