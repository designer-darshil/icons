import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AdminUser, AdminRole, AdminAuthState } from './types';

const ADMIN_STORAGE_KEY = 'gridframe_admin_session_v1';

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-001',
    name: 'Lead Designer & Admin',
    email: 'admin@gridframe.design',
    role: 'admin',
    status: 'active',
    joinedDate: '2026-01-10',
    lastActive: 'Just now',
  },
  {
    id: 'usr-002',
    name: 'Vector Quality Editor',
    email: 'editor@gridframe.design',
    role: 'editor',
    status: 'active',
    joinedDate: '2026-02-14',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr-003',
    name: 'Product Manager (Viewer)',
    email: 'viewer@gridframe.design',
    role: 'viewer',
    status: 'active',
    joinedDate: '2026-03-01',
    lastActive: 'Yesterday',
  },
];

interface AdminAuthContextType extends AdminAuthState {
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (required: AdminRole) => boolean;
  users: AdminUser[];
  updateUserRole: (userId: string, newRole: AdminRole) => void;
  updateUserStatus: (userId: string, newStatus: 'active' | 'suspended') => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem('gridframe_admin_users_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_ADMIN_USERS;
  });

  const [state, setState] = useState<AdminAuthState>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isAuthenticated && parsed?.user) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // Default logged-in as admin for seamless development & operational access
    return {
      isAuthenticated: true,
      user: DEFAULT_ADMIN_USERS[0],
      token: 'session_token_lead_admin_778912',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('gridframe_admin_users_v1', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to persist admin users', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (state.isAuthenticated && state.user) {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state));
      } else {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to persist admin session', e);
    }
  }, [state]);

  const login = useCallback(async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    const matchedUser = users.find((u) => u.email.toLowerCase() === trimmed) || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: trimmed,
      role: 'admin' as AdminRole,
      status: 'active' as const,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
    };

    if (matchedUser.status === 'suspended') {
      return { success: false, error: 'This admin account is suspended. Contact system administrator.' };
    }

    const sessionState: AdminAuthState = {
      isAuthenticated: true,
      user: matchedUser,
      token: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    setState(sessionState);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  }, []);

  const hasRole = useCallback(
    (required: AdminRole): boolean => {
      if (!state.isAuthenticated || !state.user) return false;
      if (state.user.role === 'admin') return true;
      if (state.user.role === 'editor' && (required === 'editor' || required === 'viewer')) return true;
      if (state.user.role === 'viewer' && required === 'viewer') return true;
      return false;
    },
    [state]
  );

  const updateUserRole = useCallback((userId: string, newRole: AdminRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }, []);

  const updateUserStatus = useCallback((userId: string, newStatus: 'active' | 'suspended') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      hasRole,
      users,
      updateUserRole,
      updateUserStatus,
    }),
    [state, login, logout, hasRole, users, updateUserRole, updateUserStatus]
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
