import React from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

interface WorkspaceShellProps {
  children: React.ReactNode;
  onOpenSearch?: () => void;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  children,
  onOpenSearch,
}) => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col selection:bg-accent selection:text-white antialiased">
      <Header onOpenSearch={onOpenSearch} />
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-14 pb-28 md:pb-20">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};
