'use client'

import React, { createContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ADMIN_EMAIL } from '@/lib/config';
import { AuthUser } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      updateUser(session);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUser(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUser = (session: any) => {
    if (session?.user) {
      setUser({ id: session.user.id, email: session.user.email, full_name: session.user.user_metadata?.full_name });
      setIsAdmin(session.user.email === ADMIN_EMAIL);
    } else {
      setUser(null);
      setIsAdmin(false);
    }
  };

  const signIn = (email: string, pass: string) => supabase.auth.signInWithPassword({ email, password: pass });
  
  const signUp = async (email: string, pass: string, name: string) => {
    return supabase.auth.signUp({ email, password: pass, options: { data: { full_name: name } } });
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : ''
      }
    });
  };

  const resetPassword = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
    });
  };

  const signOut = async () => { 
    await supabase.auth.signOut(); 
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signIn, signUp, signInWithGoogle, resetPassword, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};