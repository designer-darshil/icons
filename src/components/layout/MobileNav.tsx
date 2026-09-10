import React from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Tag, Palette, Heart, FolderHeart } from 'lucide-react';
import { cn } from '@/lib/cn';

export const MobileNav: React.FC = () => {
  const itemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex flex-col items-center justify-center py-1.5 px-3 flex-1 touch-target text-[10px] font-medium transition-colors',
      isActive
        ? 'text-text-primary font-semibold'
        : 'text-text-tertiary hover:text-text-secondary'
    );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur-xs border-t border-border-default pb-safe">
      <nav className="flex items-center justify-around h-13">
        <NavLink to="/icons" className={itemClass}>
          <Grid className="w-4 h-4 mb-0.5" />
          <span>Icons</span>
        </NavLink>
        <NavLink to="/categories" className={itemClass}>
          <Tag className="w-4 h-4 mb-0.5" />
          <span>Categories</span>
        </NavLink>
        <NavLink to="/styles" className={itemClass}>
          <Palette className="w-4 h-4 mb-0.5" />
          <span>Styles</span>
        </NavLink>
        <NavLink to="/favorites" className={itemClass}>
          <Heart className="w-4 h-4 mb-0.5" />
          <span>Favorites</span>
        </NavLink>
        <NavLink to="/collections" className={itemClass}>
          <FolderHeart className="w-4 h-4 mb-0.5" />
          <span>Sets</span>
        </NavLink>
      </nav>
    </div>
  );
};
