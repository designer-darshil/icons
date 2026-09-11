import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useCollections } from '@/features/collections/useCollections';
import { Grid, Tag, Palette, Heart, FolderHeart } from 'lucide-react';
import { cn } from '@/lib/cn';

export const MobileNav: React.FC = () => {
  const { count: favoritesCount } = useFavorites();
  const { count: collectionsCount } = useCollections();

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative flex flex-col items-center justify-center py-2 px-2 flex-1 touch-target text-[10px] font-mono transition-all duration-200 cursor-pointer select-none',
      isActive
        ? 'text-accent font-bold scale-105'
        : 'text-text-tertiary hover:text-text-primary'
    );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary border-t border-border-default pb-safe shadow-2xl">
      <nav className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        <NavLink to="/icons" className={itemClass}>
          {({ isActive }) => (
            <>
              <Grid className="w-4 h-4 mb-1" />
              <span>Archive</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent animate-pulse" />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/categories" className={itemClass}>
          {({ isActive }) => (
            <>
              <Tag className="w-4 h-4 mb-1" />
              <span>Domains</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent animate-pulse" />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/styles" className={itemClass}>
          {({ isActive }) => (
            <>
              <Palette className="w-4 h-4 mb-1" />
              <span>Styles</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent animate-pulse" />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/favorites" className={itemClass}>
          {({ isActive }) => (
            <>
              <div className="relative">
                <Heart className="w-4 h-4 mb-1" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-accent text-white text-[8px] font-bold rounded-full min-w-[14px] text-center">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span>Saved</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent animate-pulse" />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/collections" className={itemClass}>
          {({ isActive }) => (
            <>
              <div className="relative">
                <FolderHeart className="w-4 h-4 mb-1" />
                {collectionsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-accent text-white text-[8px] font-bold rounded-full min-w-[14px] text-center">
                    {collectionsCount}
                  </span>
                )}
              </div>
              <span>Sets</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent animate-pulse" />
              )}
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
};

