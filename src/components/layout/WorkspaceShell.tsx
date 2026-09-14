import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { CommandPalette } from '@/features/search/CommandPalette';
import { CompareBar } from '@/features/compare/CompareBar';
import { useNavigate } from 'react-router-dom';
import type { Icon } from '@/types/icon';

interface WorkspaceShellProps {
  children: React.ReactNode;
  onOpenSearch?: () => void;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  children,
  onOpenSearch,
}) => {
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenSearch = useCallback(() => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      setInternalSearchOpen(true);
    }
  }, [onOpenSearch]);

  // Global Cmd/Ctrl + K shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOpenSearch]);

  const handleSelectIcon = (icon: Icon) => {
    navigate(`/icons/${icon.slug}`);
    setInternalSearchOpen(false);
  };

  const handleSelectCategory = (category: string) => {
    navigate(`/categories/${category.toLowerCase()}`);
    setInternalSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col selection:bg-accent selection:text-white antialiased">
      <Header onOpenSearch={handleOpenSearch} />
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 py-5 sm:py-8 md:py-14 pb-28 md:pb-20">
        {children}
      </main>
      <MobileNav />

      {/* Floating Compare Tray */}
      <CompareBar />

      {/* Internal Command Palette fallback when parent route doesn't render its own */}
      {!onOpenSearch && (
        <CommandPalette
          isOpen={internalSearchOpen}
          onClose={() => setInternalSearchOpen(false)}
          onSelectIcon={handleSelectIcon}
          onSelectCategory={handleSelectCategory}
        />
      )}
    </div>
  );
};

