import type { Session, User } from '@supabase/supabase-js';

export type AdminRole = 'admin' | 'editor' | 'viewer';
export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated' | 'unauthorized';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  status: 'active' | 'suspended';
  joinedDate: string;
  lastActive: string;
}

export interface AdminAuthState {
  status: AuthStatus;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: AdminUser | null;
  supabaseUser: User | null;
  session: Session | null;
  token: string | null;
  error: string | null;
}
