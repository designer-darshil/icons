import React, { useState } from 'react';
import type { Icon } from '@/types/icon';
import { getIconTimeMachineHistory } from '@/lib/icon-intelligence/time-machine';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconTimeMachineProps {
  icon: Icon;
  className?: string;
}

export const IconTimeMachine: React.FC<IconTimeMachineProps> = ({ icon, className }) => {
  const history = getIconTimeMachineHistory(icon);
  const [selectedVersion, setSelectedVersion] = useState<string>(history.currentVersion);

  const activeSnapshot = history.history.find((h) => h.version === selectedVersion) || history.history[history.history.length - 1];

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON TIME MACHINE (CATALOG HISTORY)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
          Current: {history.currentVersion}
        </span>
      </div>

      {/* Timeline Step Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {history.history.map((snap) => (
          <button
            key={snap.version}
            type="button"
            onClick={() => setSelectedVersion(snap.version)}
            className={cn(
              'px-3 py-1.5 rounded-xs text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer border flex flex-col items-start gap-0.5',
              selectedVersion === snap.version
                ? 'bg-accent text-accent-fg border-accent font-bold shadow-2xs'
                : 'bg-bg-primary text-text-secondary border-border-default hover:text-text-primary'
            )}
          >
            <span>{snap.version}</span>
            <span className="text-[9px] opacity-80">{snap.timestamp}</span>
          </button>
        ))}
      </div>

      {/* Version Detail View */}
      <div className="p-4 rounded-xs border border-border-default bg-bg-elevated/70 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-16 h-16 rounded-xs border border-border-subtle bg-bg-primary flex items-center justify-center shrink-0">
          <IconPreviewSvg svgContent={activeSnapshot.svg} className="w-8 h-8 text-text-primary" />
        </div>

        <div className="space-y-2 flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-between flex-wrap gap-1">
            <h4 className="text-xs font-mono font-bold text-text-primary">
              Release {activeSnapshot.version} by {activeSnapshot.author}
            </h4>
            <span className="text-[10px] font-mono text-text-tertiary">{activeSnapshot.timestamp}</span>
          </div>

          <p className="text-xs text-text-secondary font-sans leading-relaxed">
            {activeSnapshot.changeSummary}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 text-[10px] font-mono text-text-tertiary pt-1">
            <span>Category: {activeSnapshot.category}</span>
            <span>•</span>
            <span>Style: {activeSnapshot.style}</span>
            <span>•</span>
            <span>Variants: {activeSnapshot.variantCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
