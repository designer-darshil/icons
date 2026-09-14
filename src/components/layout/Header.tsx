import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useCollections } from '@/features/collections/useCollections';
import { useCompare } from '@/features/compare/useCompare';
import { useLenis } from '@/hooks/useLenis';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { SkiperThemeToggle, SkiperTooltip } from '@/components/ui/skiper';
import { Heart, FolderHeart, Menu, Search, Columns } from 'lucide-react';
import { cn } from '@/lib/cn';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { count: favoritesCount } = useFavorites();
  const { count: collectionsCount } = useCollections();
  const { count: compareCount } = useCompare();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenis = useLenis();
  const location = useLocation();

  const handleLogoClick = () => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: false });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'group relative px-3.5 py-2 text-sm font-medium tracking-tight transition-colors duration-150 select-none cursor-pointer',
      isActive
        ? 'text-text-primary font-semibold'
        : 'text-text-secondary hover:text-text-primary'
    );

  const getSectionContext = () => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/icons')) return 'Archive';
    if (path.startsWith('/categories')) return 'Domains';
    if (path.startsWith('/styles')) return 'Styles';
    if (path.startsWith('/favorites')) return 'Saved';
    if (path.startsWith('/collections')) return 'Sets';
    if (path.startsWith('/design-system') || path.startsWith('/dev/design-system')) return 'Design';
    if (path.includes('qa') || path.includes('iconoir') || path.includes('rendering')) return 'QA';
    return 'Archive';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg-header transition-colors duration-150">
        {/* =========================================================================
            1. MOBILE HEADER (< md): 52–60px Compact Dedicated Structure
            LEFT: Gridframe Mark/Logo
            CENTER: Current Section/Page Context
            RIGHT: Search, Theme, Menu
            ========================================================================= */}
        <div className="flex md:hidden h-14 items-center justify-between px-4 sm:px-6 w-full">
          {/* Left: Compact Logo Mark */}
          <Link
            to="/icons"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group select-none cursor-pointer shrink-0"
            aria-label="Gridframe Studio"
          >
            <div className="w-6 h-6 border border-border-strong rounded-xs flex items-center justify-center p-1 bg-bg-secondary group-hover:border-accent transition-colors">
              <div className="w-full h-full bg-accent rounded-3xs group-hover:scale-90 transition-transform" />
            </div>
            <span className="text-xs font-extrabold font-mono tracking-widest text-text-primary uppercase leading-none">
              GRIDFRAME
            </span>
          </Link>

          {/* Center: Context Badge */}
          <div className="hidden sm:flex items-center justify-center px-1 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full bg-bg-secondary/80 border border-border-subtle/80 text-[10px] font-mono font-medium text-text-secondary uppercase tracking-wider select-none truncate max-w-[120px]">
              {getSectionContext()}
            </span>
          </div>

          {/* Right: Search, Theme, Menu with comfortable touch targets */}
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Open search command palette"
              className="w-10 h-10 text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60 rounded-full flex items-center justify-center transition-colors cursor-pointer touch-manipulation min-w-[40px] min-h-[40px]"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <div className="w-10 h-10 flex items-center justify-center">
              <SkiperThemeToggle />
            </div>

            {/* Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation drawer"
              className="w-10 h-10 text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60 rounded-full flex items-center justify-center transition-colors cursor-pointer touch-manipulation min-w-[40px] min-h-[40px]"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. DESKTOP HEADER (>= md): Full Approved Layout Preserved
            ========================================================================= */}
        <div className="hidden md:flex max-w-[1600px] mx-auto px-4 sm:px-10 md:px-14 h-20 sm:h-24 items-center justify-between gap-4 sm:gap-10">
          {/* Left: Brand & Studio Wordmark */}
          <div className="flex items-center gap-6 sm:gap-10 lg:gap-14">
            {/* Studio Wordmark Logo */}
            <Link
              to="/icons"
              onClick={handleLogoClick}
              className="flex items-center gap-3.5 group select-none cursor-pointer"
              aria-label="Gridframe Studio Monograph"
            >
              <div className="w-7 h-7 border border-border-strong rounded-xs flex items-center justify-center p-1.5 bg-bg-secondary group-hover:border-accent transition-colors">
                <div className="w-full h-full bg-accent rounded-3xs group-hover:scale-90 group-hover:rotate-45 transition-all duration-300 ease-out" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold font-mono tracking-widest text-text-primary uppercase leading-tight group-hover:text-accent transition-colors">
                    GRIDFRAME
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
                    № 02
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-text-tertiary uppercase">
                  MONOGRAPH ARCHIVE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-6 lg:gap-8">
              <NavLink to="/icons" className={navLinkClass}>
                {({ isActive }) => (
                  <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
                    <span className="text-[10px] text-text-tertiary font-bold">01</span>
                    <span>Archive</span>
                    {isActive && <span className="w-1 h-1 rounded-full bg-accent ml-0.5" />}
                  </span>
                )}
              </NavLink>
              <NavLink to="/categories" className={navLinkClass}>
                {({ isActive }) => (
                  <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
                    <span className="text-[10px] text-text-tertiary font-bold">02</span>
                    <span>Domains</span>
                    {isActive && <span className="w-1 h-1 rounded-full bg-accent ml-0.5" />}
                  </span>
                )}
              </NavLink>
              <NavLink to="/styles" className={navLinkClass}>
                {({ isActive }) => (
                  <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
                    <span className="text-[10px] text-text-tertiary font-bold">03</span>
                    <span>Styles</span>
                    {isActive && <span className="w-1 h-1 rounded-full bg-accent ml-0.5" />}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>

          {/* Right: Saved Counter, Collections & Theme Toggle */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Saved Items Link */}
            <SkiperTooltip content="Saved favorite icons" side="bottom">
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 py-1.5 px-2 text-sm font-medium tracking-tight transition-colors cursor-pointer',
                    isActive
                      ? 'text-text-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  )
                }
                title="Saved Icons"
              >
                <Heart className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors" />
                <span className="hidden lg:inline">Saved</span>
                {favoritesCount > 0 && (
                  <span className="text-[10px] font-mono text-accent font-bold px-1.5 py-0.2 bg-accent/10 border border-accent/20 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </NavLink>
            </SkiperTooltip>

            {/* Collections Link */}
            <SkiperTooltip content="Custom collections" side="bottom">
              <NavLink
                to="/collections"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 py-1.5 px-2 text-sm font-medium tracking-tight transition-colors cursor-pointer',
                    isActive
                      ? 'text-text-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  )
                }
                title="Icon Sets"
              >
                <FolderHeart className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors" />
                <span className="hidden lg:inline">Sets</span>
                {collectionsCount > 0 && (
                  <span className="text-[10px] font-mono text-accent font-bold px-1.5 py-0.2 bg-accent/10 border border-accent/20 rounded-full">
                    {collectionsCount}
                  </span>
                )}
              </NavLink>
            </SkiperTooltip>

            {/* Compare Link */}
            <SkiperTooltip content="Icon comparison workstation" side="bottom">
              <NavLink
                to="/compare"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 py-1.5 px-2 text-sm font-medium tracking-tight transition-colors cursor-pointer',
                    isActive
                      ? 'text-text-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  )
                }
                title="Compare Icons"
              >
                <Columns className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors" />
                <span className="hidden lg:inline">Compare</span>
                {compareCount > 0 && (
                  <span className="text-[10px] font-mono text-accent font-bold px-1.5 py-0.2 bg-accent/10 border border-accent/20 rounded-full">
                    {compareCount}
                  </span>
                )}
              </NavLink>
            </SkiperTooltip>

            <div className="hidden sm:block h-5 w-[1px] bg-border-subtle/50" />

            {/* Theme Toggle (Dark / Light only) */}
            <SkiperTooltip content="Toggle dark / light theme" side="bottom">
              <SkiperThemeToggle />
            </SkiperTooltip>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

