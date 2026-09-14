import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/features/admin/auth/AdminAuthContext';
import { useTheme } from '@/hooks/useTheme';

export const AdminLoginRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, status, login, resetPassword } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);

  // Parse redirect target safely
  const rawFrom = (location.state as { from?: { pathname?: string; search?: string } })?.from;
  const redirectTarget =
    rawFrom?.pathname && rawFrom.pathname.startsWith('/admin')
      ? `${rawFrom.pathname}${rawFrom.search || ''}`
      : new URLSearchParams(location.search).get('redirect') || '/admin';

  // If already authenticated and authorized as admin, redirect immediately
  if (status !== 'loading' && isAuthenticated && isAdmin) {
    return <Navigate to={redirectTarget.startsWith('/admin') ? redirectTarget : '/admin'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setInfoMessage(null);

    if (isForgotMode) {
      const res = await resetPassword(email);
      setIsLoading(false);
      if (res.success) {
        setInfoMessage('If this account exists, a password reset link has been sent to your email.');
      } else {
        setError(res.error || 'Unable to send reset email. Please try again.');
      }
      return;
    }

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate(redirectTarget.startsWith('/admin') ? redirectTarget : '/admin', { replace: true });
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header bar with Logo + Theme toggle */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/icons" className="flex items-center gap-2 text-text-primary hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded bg-action-primary text-text-inverse flex items-center justify-center font-mono font-bold text-xs">
            G
          </div>
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-text-primary">GRIDFRAME</span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          className="p-2 rounded-lg border border-border-subtle bg-bg-surface hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8 bg-bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 select-none">
          <div className="w-10 h-10 bg-action-primary rounded-xl mx-auto flex items-center justify-center text-text-inverse font-mono font-bold text-lg shadow-sm">
            G
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold font-mono tracking-tight text-text-primary uppercase">
              GRIDFRAME ADMIN
            </h1>
            <p className="text-xs font-mono text-text-tertiary">
              {isForgotMode ? 'Reset your administrator password' : 'Sign in to access catalog management'}
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-mono text-rose-500 flex items-center gap-2">
            <span className="shrink-0 text-sm">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Info Message */}
        {infoMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-mono text-emerald-500 flex items-center gap-2">
            <span className="shrink-0 text-sm">✓</span>
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="text-xs font-mono font-medium text-text-secondary block">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 bg-bg-secondary border border-border-subtle rounded-lg text-xs font-sans text-text-primary focus:outline-none focus:border-action-primary transition-colors min-h-[44px]"
            />
          </div>

          {!isForgotMode && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="admin-password" className="text-xs font-mono font-medium text-text-secondary block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(true);
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-[11px] font-mono text-text-tertiary hover:text-action-primary transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 bg-bg-secondary border border-border-subtle rounded-lg text-xs font-sans text-text-primary focus:outline-none focus:border-action-primary transition-colors min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-action-primary hover:bg-action-primary/90 text-text-inverse font-mono text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isForgotMode ? 'Sending link...' : 'Signing in...'}</span>
              </>
            ) : (
              <span>{isForgotMode ? 'Send Reset Link' : 'Sign in'}</span>
            )}
          </button>

          {isForgotMode && (
            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                setError(null);
                setInfoMessage(null);
              }}
              className="w-full py-2 text-center text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              ← Back to Sign in
            </button>
          )}
        </form>
      </div>

      {/* Footer link */}
      <div className="text-center text-xs font-mono text-text-tertiary py-2">
        <Link to="/icons" className="hover:text-text-primary transition-colors">
          ← Return to Public Icon Library
        </Link>
      </div>
    </div>
  );
};
export default AdminLoginRoute;
