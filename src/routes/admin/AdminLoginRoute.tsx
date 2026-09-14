import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAdminAuth, DEFAULT_ADMIN_USERS } from '@/features/admin/auth/AdminAuthContext';

export const AdminLoginRoute: React.FC = () => {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@gridframe.design');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Invalid admin credentials');
    }
  };

  const handleSelectDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('••••••••••••');
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-bg-surface border border-border-subtle rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-action-primary rounded-lg mx-auto flex items-center justify-center text-text-inverse font-mono font-bold text-lg shadow-sm">
            G
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-text-primary">GRIDFRAME CMS</h1>
          <p className="text-xs text-text-tertiary">Sign in to access the catalog management system</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-xs font-mono text-rose-500 flex items-center gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-text-secondary">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gridframe.design"
              className="w-full px-3 py-2 bg-bg-secondary border border-border-subtle rounded-md text-xs font-sans text-text-primary focus:outline-none focus:border-action-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-text-secondary">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-bg-secondary border border-border-subtle rounded-md text-xs font-sans text-text-primary focus:outline-none focus:border-action-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-action-primary hover:bg-action-primary/90 text-text-inverse font-mono text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              'Sign In to Admin Panel'
            )}
          </button>
        </form>

        {/* Demo Fast Access */}
        <div className="pt-4 border-t border-border-subtle space-y-2.5">
          <p className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider text-center">
            Quick Demo Accounts
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            {DEFAULT_ADMIN_USERS.map((usr) => (
              <button
                key={usr.id}
                type="button"
                onClick={() => handleSelectDemoUser(usr.email)}
                className={`px-2 py-1.5 rounded border text-[11px] transition-colors ${
                  email === usr.email
                    ? 'bg-action-primary/10 border-action-primary text-action-primary font-semibold'
                    : 'bg-bg-secondary border-border-subtle text-text-secondary hover:bg-bg-surface'
                }`}
              >
                <div className="font-bold uppercase">{usr.role}</div>
                <div className="text-[10px] text-text-tertiary truncate">{usr.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
