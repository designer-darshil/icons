import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useCollections } from '@/features/collections/useCollections';
import { Search, Heart, FolderHeart } from 'lucide-react';
import { SkiperThemeToggle, SkiperTooltip } from '@/components/ui/skiper';
import { cn } from '@/lib/cn';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { count: favoritesCount } = useFavorites();
  const { count: collectionsCount } = useCollections();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'px-2.5 py-1 text-xs font-mono rounded-xs transition-colors',
      isActive
        ? 'text-text-primary bg-bg-secondary font-semibold'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
    );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-default bg-bg-primary/95 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Left: Brand & Primary Nav */}
        <div className="flex items-center gap-6">
          <Link
            to="/icons"
            className="flex items-center gap-2 group select-none"
            aria-label="Gridframe Home"
          >
            <div className="w-5 h-5 border border-text-primary rounded-xs flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-text-primary rounded-2xs" />
            </div>
            <span className="text-xs font-bold font-mono tracking-widest text-text-primary uppercase">
              GRIDFRAME
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/icons" className={navLinkClass}>
              Icons
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              Categories
            </NavLink>
            <NavLink to="/styles" className={navLinkClass}>
              Styles
            </NavLink>
          </nav>
        </div>

        {/* Right: Search, Saved & Theme */}
        <div className="flex items-center gap-2">
          {/* Global Search Trigger with SkiperTooltip */}
          <SkiperTooltip content="Press ⌘K to open command search" side="bottom">
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 h-7.5 px-2.5 text-xs font-mono text-text-tertiary bg-bg-secondary border border-border-default rounded-xs hover:border-border-strong hover:text-text-secondary transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search icons...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-bg-elevated border border-border-default rounded-2xs text-[10px] font-mono text-text-muted">
                ⌘K
              </kbd>
            </button>
          </SkiperTooltip>

          <div className="hidden sm:block h-3.5 w-[1px] bg-border-default mx-1" />

          {/* Secondary Nav: Favorites & Collections */}
          <SkiperTooltip content="Saved favorite icons" side="bottom">
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 h-7.5 px-2 text-xs font-mono rounded-xs transition-colors',
                  isActive
                    ? 'text-text-primary bg-bg-secondary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                )
              }
              title="Favorite Icons"
            >
              <Heart className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Favorites</span>
              {favoritesCount > 0 && (
                <span className="text-[10px] font-mono text-text-muted px-1 bg-bg-elevated rounded-2xs">
                  {favoritesCount}
                </span>
              )}
            </NavLink>
          </SkiperTooltip>

          <SkiperTooltip content="Custom collections" side="bottom">
            <NavLink
              to="/collections"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 h-7.5 px-2 text-xs font-mono rounded-xs transition-colors',
                  isActive
                    ? 'text-text-primary bg-bg-secondary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                )
              }
              title="Icon Collections"
            >
              <FolderHeart className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Collections</span>
              {collectionsCount > 0 && (
                <span className="text-[10px] font-mono text-text-muted px-1 bg-bg-elevated rounded-2xs">
                  {collectionsCount}
                </span>
              )}
            </NavLink>
          </SkiperTooltip>

          {/* Skiper Animated Theme Toggle */}
          <SkiperTooltip content="Toggle dark / light theme" side="bottom">
            <SkiperThemeToggle />
          </SkiperTooltip>
        </div>
      </div>
    </header>
  );
};

