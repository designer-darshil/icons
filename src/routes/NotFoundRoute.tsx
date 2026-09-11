import React from 'react';
import { Link } from 'react-router-dom';
import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ArrowLeft, Compass, Grid, Tag, Palette } from 'lucide-react';

export const NotFoundRoute: React.FC = () => {
  useDocumentTitle('404 — Not Found', 'The requested vector specimen or route does not exist.');

  return (
    <WorkspaceShell>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 max-w-2xl mx-auto space-y-8">
        {/* Monograph Geometry Specimen Frame */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xs bg-bg-secondary/40 border border-border-default flex items-center justify-center select-none shadow-dropdown">
          {/* Corner optical marks */}
          <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-border-strong" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-border-strong" />
          <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-border-strong" />
          <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-border-strong" />

          {/* Center Crosshairs */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-t border-dashed border-border-subtle/50" />
          <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 border-l border-dashed border-border-subtle/50" />

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-accent tracking-tighter">
              404
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">
              NOT FOUND
            </span>
          </div>
        </div>

        {/* Narrative & Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-3xs bg-accent/10 border border-accent/20 text-accent font-mono text-xs uppercase font-bold tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Unknown Coordinate</span>
          </div>

          <h1 className="type-h1 text-text-primary">
            That page doesn't exist.
          </h1>

          <p className="type-body text-text-secondary max-w-md mx-auto leading-relaxed">
            The vector specimen, category domain, or route you are looking for has been relocated or does not exist in the archive monograph.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link to="/icons" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto font-mono text-xs uppercase tracking-wider gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Archive</span>
            </Button>
          </Link>
        </div>

        {/* Secondary Quick Jump Directory */}
        <div className="pt-8 border-t border-border-subtle/60 w-full max-w-md space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block">
            Alternative Destinations
          </span>
          <div className="grid grid-cols-3 gap-2">
            <Link
              to="/icons"
              className="p-3 rounded-xs border border-border-subtle/80 bg-bg-secondary/30 hover:bg-bg-secondary hover:border-border-strong transition-all flex flex-col items-center gap-1.5 text-text-secondary hover:text-text-primary group"
            >
              <Grid className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
              <span className="text-xs font-mono">Archive</span>
            </Link>

            <Link
              to="/categories"
              className="p-3 rounded-xs border border-border-subtle/80 bg-bg-secondary/30 hover:bg-bg-secondary hover:border-border-strong transition-all flex flex-col items-center gap-1.5 text-text-secondary hover:text-text-primary group"
            >
              <Tag className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
              <span className="text-xs font-mono">Domains</span>
            </Link>

            <Link
              to="/styles"
              className="p-3 rounded-xs border border-border-subtle/80 bg-bg-secondary/30 hover:bg-bg-secondary hover:border-border-strong transition-all flex flex-col items-center gap-1.5 text-text-secondary hover:text-text-primary group"
            >
              <Palette className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
              <span className="text-xs font-mono">Styles</span>
            </Link>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
};

export default NotFoundRoute;
