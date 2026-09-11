import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SkiperThemeToggle } from '@/components/ui/skiper';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useCollections } from '@/features/collections/useCollections';
import { useScrollLock } from '@/hooks/useScrollLock';
import { X, Heart, FolderHeart } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const prefersReducedMotion = useReducedMotion();
  const { count: favoriteCount } = useFavorites();
  const { count: collectionCount } = useCollections();

  // Unified scroll lock coordinates Lenis & body overflow
  useScrollLock(isOpen);

  const navItems = [
    {
      label: 'Archive',
      sublabel: '7,508 Vector Concepts',
      href: '/icons',
    },
    {
      label: 'Categories',
      sublabel: 'Domain taxonomies & systems',
      href: '/categories',
    },
    {
      label: 'Styles',
      sublabel: 'Line, Filled, Bold & Duotone',
      href: '/styles',
    },
  ];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const drawerVariants = {
    closed: { x: '100%' },
    open: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Editorial Studio Navigation Menu"
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-bg-overlay cursor-pointer"
            initial="closed"
            animate="open"
            exit="closed"
            variants={prefersReducedMotion ? undefined : overlayVariants}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Editorial Drawer Content */}
          <motion.div
            className="relative w-full max-w-sm sm:max-w-md bg-bg-primary border-l border-border-subtle/50 h-full flex flex-col justify-between shadow-2xl z-10"
            initial="closed"
            animate="open"
            exit="closed"
            variants={prefersReducedMotion ? undefined : drawerVariants}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Drawer Top / Header */}
            <div className="p-6 sm:p-8 flex items-center justify-between border-b border-border-subtle/30">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border border-border-strong rounded-xs flex items-center justify-center p-1 bg-bg-secondary">
                  <div className="w-full h-full bg-accent rounded-3xs" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold font-mono tracking-widest text-text-primary uppercase leading-tight">
                    GRIDFRAME
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-text-tertiary uppercase">
                    STUDIO ARCHIVE
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close navigation"
                onClick={onClose}
                className="w-11 h-11 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-secondary/80 border border-border-subtle/60 transition-colors cursor-pointer touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Navigation Links */}
            <div
              data-lenis-prevent="true"
              className="flex-1 px-6 sm:px-8 py-8 overflow-y-auto space-y-6 overscroll-contain native-scroll"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary block mb-4">
                  Archive Index
                </span>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center justify-between py-3 px-3 rounded-sm transition-all duration-200',
                          isActive
                            ? 'bg-bg-secondary text-text-primary font-semibold'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40'
                        )
                      }
                    >
                      <div className="flex flex-col">
                        <span className="text-lg tracking-tight font-medium group-hover:translate-x-0.5 transition-transform">
                          {item.label}
                        </span>
                        <span className="text-xs font-mono text-text-tertiary font-normal">
                          {item.sublabel}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* Collections & Saved Section */}
              <div className="pt-6 border-t border-border-subtle/30 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary block mb-3">
                  Curation & Storage
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <NavLink
                    to="/favorites"
                    onClick={onClose}
                    className="p-3.5 rounded-sm border border-border-subtle/60 hover:border-border-strong bg-bg-secondary/30 hover:bg-bg-secondary flex flex-col gap-2 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Heart className="w-4 h-4 text-text-secondary" />
                      {favoriteCount > 0 && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/20">
                          {favoriteCount}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">Saved</div>
                      <div className="text-[10px] font-mono text-text-tertiary">Pinned icons</div>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/collections"
                    onClick={onClose}
                    className="p-3.5 rounded-sm border border-border-subtle/60 hover:border-border-strong bg-bg-secondary/30 hover:bg-bg-secondary flex flex-col gap-2 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <FolderHeart className="w-4 h-4 text-text-secondary" />
                      {collectionCount > 0 && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/20">
                          {collectionCount}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">Sets</div>
                      <div className="text-[10px] font-mono text-text-tertiary">Custom suites</div>
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Footer / Theme & Studio Meta */}
            <div className="p-6 sm:p-8 border-t border-border-subtle/30 bg-bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkiperThemeToggle size="md" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">Theme Mode</span>
                  <span className="text-[10px] font-mono text-text-tertiary">Light / Dark Monochrome</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-text-tertiary block">GRIDFRAME V2</span>
                <span className="text-[9px] font-mono text-text-muted">7,508 Vectors</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

