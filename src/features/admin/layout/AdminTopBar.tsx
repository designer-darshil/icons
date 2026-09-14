import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../auth/AdminAuthContext';
import { useTheme } from '@/hooks/useTheme';
import { AdminSearchModal } from './AdminSearchModal';

interface AdminTopBarProps {
  onToggleMobileSidebar: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Compute title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/icons') return 'Icons Directory';
    if (path.startsWith('/admin/icons/')) return 'Icon Editor';
    if (path === '/admin/categories') return 'Category Taxonomy';
    if (path === '/admin/styles') return 'Canonical Styles';
    if (path === '/admin/collections') return 'Curated Collections';
    if (path === '/admin/users') return 'Team & Access';
    if (path === '/admin/activity') return 'Activity & Audit Log';
    if (path === '/admin/settings') return 'Admin Settings';
    return 'Admin';
  };

  return (
    <>
      <header className="h-14 bg-bg-surface border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
        {/* Left Section: Mobile Menu + Breadcrumb/Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
            aria-label="Toggle navigation sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-tertiary hidden sm:inline">GRIDFRAME /</span>
            <h1 className="text-sm font-semibold text-text-primary font-mono tracking-tight">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Right Section: Search + Theme + Activity + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary/70 hover:bg-bg-secondary border border-border-subtle rounded-md text-xs text-text-tertiary hover:text-text-primary transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline font-sans">Quick search...</span>
            <kbd className="hidden sm:inline px-1 py-0.5 text-[10px] font-mono bg-bg-surface border border-border-subtle rounded text-text-tertiary">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle (Dark / Light only) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
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

          {/* Activity Log shortcut */}
          <Link
            to="/admin/activity"
            className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors relative"
            title="View Activity Log"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-action-primary" />
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-bg-secondary transition-colors text-left"
            >
              <div className="w-6 h-6 rounded-full bg-action-primary/20 border border-action-primary/30 flex items-center justify-center text-action-primary font-mono text-[10px] font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-mono text-text-primary hidden md:inline font-medium">
                {user?.name || 'Admin'}
              </span>
              <svg className="w-3 h-3 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-bg-surface border border-border-subtle rounded-lg shadow-xl py-1.5 z-50 text-xs font-sans divide-y divide-border-subtle/60 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2">
                    <p className="font-semibold text-text-primary font-mono">{user?.name}</p>
                    <p className="text-[11px] text-text-tertiary font-mono">{user?.email}</p>
                    <div className="mt-1 inline-block text-[10px] font-mono uppercase font-semibold px-1.5 py-0.5 bg-bg-secondary rounded border border-border-subtle text-action-primary">
                      {user?.role} Role
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/admin/settings"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-3 py-1.5 hover:bg-bg-secondary text-text-secondary hover:text-text-primary"
                    >
                      Admin Settings
                    </Link>
                    <Link
                      to="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3 py-1.5 hover:bg-bg-secondary text-text-secondary hover:text-text-primary"
                    >
                      View Public Site ↗
                    </Link>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-500/10 text-rose-500 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Omnibox Modal */}
      <AdminSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
