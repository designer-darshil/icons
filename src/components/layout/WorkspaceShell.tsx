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
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col selection:bg-bg-elevated selection:text-text-primary">
      <Header onOpenSearch={onOpenSearch} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-12">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};
