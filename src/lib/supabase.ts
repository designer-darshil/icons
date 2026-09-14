import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return String(import.meta.env[key]);
    }
  } catch {
    // Ignore in non-Vite contexts
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return String(process.env[key]);
    }
  } catch {
    // Ignore in non-Node contexts
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('placeholder')
  );
};

// Singleton Supabase client instance
// If environment variables are not provided in a given environment, initialize with a fallback placeholder
// and handle unconfigured states safely without throwing unhandled exceptions.
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'gridframe_sb_auth_v1',
    },
  }
);
