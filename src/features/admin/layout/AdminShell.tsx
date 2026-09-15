import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminAuthProvider } from '../auth/AdminAuthContext';
import { AdminActivityProvider } from '../context/AdminActivityContext';
import { AdminCatalogProvider } from '../context/AdminCatalogContext';
import { AdminGuard } from '../auth/AdminGuard';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { AdminCommandPalette } from './AdminCommandPalette';

export const AdminShell: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AdminAuthProvider>
      <AdminActivityProvider>
        <AdminCatalogProvider>
          <AdminGuard>
            <div className="min-h-screen bg-bg-primary text-text-primary antialiased flex flex-col md:flex-row overflow-x-hidden font-sans">
              {/* Left Sidebar */}
              <AdminSidebar
                isOpen={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
                <AdminTopBar
                  onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                />
                <main id="admin-main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
                  <Outlet />
                </main>
              </div>

              {/* Global Command Palette */}
              <AdminCommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
              />
            </div>
          </AdminGuard>
        </AdminCatalogProvider>
      </AdminActivityProvider>
    </AdminAuthProvider>
  );
};
