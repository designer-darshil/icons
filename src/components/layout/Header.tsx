import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useCollections } from '@/features/collections/useCollections';
import { useLenis } from '@/hooks/useLenis';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { SkiperThemeToggle, SkiperTooltip } from '@/components/ui/skiper';
import { Heart, FolderHeart, Menu } from 'lucide-react';
import { cn } from '@/lib/cn';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch: _onOpenSearch }) => {
  const { count: favoritesCount } = useFavorites();
  const { count: collectionsCount } = useCollections();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenis = useLenis();

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

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg-primary transition-colors">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 md:px-14 h-20 sm:h-24 flex items-center justify-between gap-4 sm:gap-10">
          {/* Left: Brand & Studio Wordmark */}
          <div className="flex items-center gap-6 sm:gap-10 lg:gap-14">
            {/* Mobile Menu Button (<768px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2.5 -ml-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-xs transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
            >
              <Menu className="w-5 h-5" />
            </button>

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
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
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

          {/* Right: Sleek Search Trigger, Saved Counter & Theme Toggle */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Header search trigger commented out to keep the in-page Primary Search as the single visual focal point */}
            {/* 
            <SkiperTooltip content="Press ⌘K to open command search" side="bottom">
              <button
                type="button"
                onClick={onOpenSearch}
                className="group flex items-center gap-3.5 h-11 px-4 text-xs font-mono text-text-tertiary bg-bg-secondary/40 hover:bg-bg-secondary border border-border-subtle/70 hover:border-border-strong rounded-full hover:text-text-secondary transition-all cursor-pointer w-40 sm:w-64 md:w-72 justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Search className="w-4 h-4 shrink-0 text-text-tertiary group-hover:text-accent transition-colors" />
                  <span className="truncate text-text-secondary text-[12px]">Search archive...</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 bg-bg-elevated/80 border border-border-subtle/80 rounded-full text-[10px] font-mono text-text-muted shrink-0 group-hover:border-border-strong transition-colors">
                  ⌘K
                </kbd>
              </button>
            </SkiperTooltip>
            */}

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
