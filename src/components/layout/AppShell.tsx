import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ScrollRestoration } from './ScrollRestoration';
import { RouteLoader } from '@/components/system/AppLoader';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary antialiased">
      <ScrollRestoration />
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-action-primary focus:text-text-inverse focus:rounded-sm text-xs font-mono"
      >
        Skip to main content
      </a>

      <Suspense fallback={<RouteLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};


