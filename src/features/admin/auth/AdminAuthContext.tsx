import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { AdminUser, AdminRole, AdminAuthState } from './types';

// Designated Administrator Email Addresses
export const AUTHORIZED_ADMIN_EMAILS = new Set([
  'darshilbhuva4322@gmail.com',
  'admin@gridframe.design',
]);

/**
 * Validates if an authenticated Supabase user holds administrator privileges.
 */
export function isUserAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase().trim();

  // 1. Check explicit app metadata role
  if (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin') {
    return true;
  }

  // 2. Check authorized admin email list or domain
  if (AUTHORIZED_ADMIN_EMAILS.has(email) || email.endsWith('@gridframe.design')) {
    return true;
  }

  return false;
}

/**
 * Maps a Supabase Auth User object to the Gridframe AdminUser model.
 */
export function mapSupabaseUserToAdmin(user: User): AdminUser {
  const email = user.email || 'admin@gridframe.design';
  const role: AdminRole = isUserAdmin(user)
    ? ((user.app_metadata?.role || user.user_metadata?.role || 'admin') as AdminRole)
    : 'viewer';

  const name =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    id: user.id,
    name,
    email,
    role,
    avatarUrl: user.user_metadata?.avatar_url,
    status: 'active',
    joinedDate: user.created_at ? user.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    lastActive: 'Just now',
  };
}

interface AdminAuthContextType extends AdminAuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  hasRole: (required: AdminRole) => boolean;
  users: AdminUser[];
  updateUserRole: (userId: string, newRole: AdminRole) => void;
  updateUserStatus: (userId: string, newStatus: 'active' | 'suspended') => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminAuthState>({
    status: 'loading',
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    supabaseUser: null,
    session: null,
    token: null,
    error: null,
  });

  const [managedUsers, setManagedUsers] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem('gridframe_admin_users_v2');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  // Evaluate Supabase session & user authorization
  const evaluateSession = useCallback((session: Session | null) => {
    if (!session || !session.user) {
      setState({
        status: 'unauthenticated',
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        supabaseUser: null,
        session: null,
        token: null,
        error: null,
      });
      return;
    }

    const sbUser = session.user;
    const adminUser = mapSupabaseUserToAdmin(sbUser);
    const hasAdminAccess = isUserAdmin(sbUser);

    setState({
      status: hasAdminAccess ? 'authenticated' : 'unauthorized',
      isAuthenticated: true,
      isAdmin: hasAdminAccess,
      user: adminUser,
      supabaseUser: sbUser,
      session,
      token: session.access_token,
      error: null,
    });
  }, []);

  // Initialize session on mount and listen to Supabase auth events
  useEffect(() => {
    let isMounted = true;

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('Failed to retrieve Supabase session:', error.message);
        setState((prev) => ({ ...prev, status: 'unauthenticated' }));
      } else {
        evaluateSession(session);
      }
    }).catch((err) => {
      if (!isMounted) return;
      console.error('Supabase session initialization error:', err);
      setState((prev) => ({ ...prev, status: 'unauthenticated' }));
    });

    // 2. Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      evaluateSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [evaluateSession]);

  // Persist managed users list
  useEffect(() => {
    try {
      if (managedUsers.length > 0) {
        localStorage.setItem('gridframe_admin_users_v2', JSON.stringify(managedUsers));
      }
    } catch {
      // ignore
    }
  }, [managedUsers]);

  // Login handler with Supabase Auth
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error || !data.user || !data.session) {
        return { success: false, error: 'Invalid email or password.' };
      }

      const hasAdmin = isUserAdmin(data.user);
      if (!hasAdmin) {
        evaluateSession(data.session);
        return {
          success: false,
          error: 'Access denied. Account does not have administrator privileges.',
        };
      }

      evaluateSession(data.session);
      return { success: true };
    } catch (err) {
      console.error('Admin login error:', err);
      return { success: false, error: 'Invalid email or password.' };
    }
  }, [evaluateSession]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Supabase signOut error:', err);
    } finally {
      setState({
        status: 'unauthenticated',
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        supabaseUser: null,
        session: null,
        token: null,
        error: null,
      });
    }
  }, []);

  // Password reset handler
  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/admin/login`,
      });
      if (error) {
        return { success: false, error: 'Unable to send reset email. Please try again.' };
      }
      return { success: true };
    } catch (err) {
      console.error('Reset password error:', err);
      return { success: false, error: 'Unable to send reset email. Please try again.' };
    }
  }, []);

  const hasRole = useCallback(
    (required: AdminRole): boolean => {
      if (!state.isAuthenticated || !state.user || !state.isAdmin) return false;
      if (state.user.role === 'admin') return true;
      if (state.user.role === 'editor' && (required === 'editor' || required === 'viewer')) return true;
      if (state.user.role === 'viewer' && required === 'viewer') return true;
      return false;
    },
    [state]
  );

  const updateUserRole = useCallback((userId: string, newRole: AdminRole) => {
    setManagedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }, []);

  const updateUserStatus = useCallback((userId: string, newStatus: 'active' | 'suspended') => {
    setManagedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  }, []);

  const effectiveUsers = useMemo(() => {
    if (state.user && !managedUsers.some((u) => u.id === state.user?.id)) {
      return [state.user, ...managedUsers];
    }
    return managedUsers.length > 0 ? managedUsers : state.user ? [state.user] : [];
  }, [state.user, managedUsers]);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      resetPassword,
      hasRole,
      users: effectiveUsers,
      updateUserRole,
      updateUserStatus,
    }),
    [state, login, logout, resetPassword, hasRole, effectiveUsers, updateUserRole, updateUserStatus]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
