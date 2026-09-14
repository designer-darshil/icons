import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export const AdminAccessDenied: React.FC = () => {
  const { user, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-bg-surface border border-border-subtle rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* Shield Warning Icon */}
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto text-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold font-mono tracking-tight text-text-primary">Access Denied</h1>
          <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider">403 — Unauthorized</p>
        </div>

        <div className="p-3 bg-bg-secondary border border-border-subtle rounded-md text-xs font-mono text-text-secondary text-left space-y-1">
          <p className="text-text-tertiary">Authenticated as:</p>
          <p className="text-text-primary font-semibold truncate">{user?.email || 'Unknown Account'}</p>
          <p className="text-[11px] text-rose-400 pt-1">
            This account does not have administrator privileges to access the Gridframe CMS management console.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={logout}
            className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-mono text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Sign Out & Switch Account
          </button>

          <Link
            to="/icons"
            className="block w-full py-2.5 px-4 bg-bg-secondary hover:bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary font-mono text-xs rounded-md transition-colors text-center"
          >
            ← Return to Public Library
          </Link>
        </div>
      </div>
    </div>
  );
};
