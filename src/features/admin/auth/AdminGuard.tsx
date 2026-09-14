import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import { AdminAccessDenied } from './AdminAccessDenied';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status, isAuthenticated, isAdmin } = useAdminAuth();
  const location = useLocation();

  // 1. Loading state during session resolution
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-4 font-mono select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-action-primary text-text-inverse flex items-center justify-center font-bold text-sm shadow-sm animate-pulse">
            G
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span className="w-3 h-3 border-2 border-action-primary border-t-transparent rounded-full animate-spin" />
            <span>Verifying session...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated -> Redirect to Login
  if (!isAuthenticated || status === 'unauthenticated') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but Unauthorized (Non-admin Supabase account)
  if (status === 'unauthorized' || !isAdmin) {
    return <AdminAccessDenied />;
  }

  // 4. Authenticated & Authorized Admin
  return <>{children}</>;
};
