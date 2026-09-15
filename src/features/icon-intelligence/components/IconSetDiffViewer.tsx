import React from 'react';
import type { Icon } from '@/types/icon';
import { diffIconSets } from '@/lib/icon-intelligence/diff';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconSetDiffViewerProps {
  setA: Icon[];
  setB: Icon[];
  setAName?: string;
  setBName?: string;
  className?: string;
}

export const IconSetDiffViewer: React.FC<IconSetDiffViewerProps> = ({
  setA,
  setB,
  setAName = 'Original Set',
  setBName = 'Target Set',
  className,
}) => {
  const diff = diffIconSets(setA, setB);

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-5', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON SET DIFF & COMPARISON
          </h3>
        </div>
        <span className="text-[10px] font-mono text-text-tertiary">
          Comparing {setAName} ({setA.length}) ↔ {setBName} ({setB.length})
        </span>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs font-mono">
        <div className="p-2.5 rounded-xs border border-status-success/30 bg-status-success/10 text-status-success">
          <span className="block text-base font-bold">+{diff.summary.addedCount}</span>
          <span className="text-[10px] uppercase">Added</span>
        </div>
        <div className="p-2.5 rounded-xs border border-status-error/30 bg-status-error/10 text-status-error">
          <span className="block text-base font-bold">-{diff.summary.removedCount}</span>
          <span className="text-[10px] uppercase">Removed</span>
        </div>
        <div className="p-2.5 rounded-xs border border-accent/30 bg-accent/10 text-accent">
          <span className="block text-base font-bold">↔{diff.summary.replacedCount}</span>
          <span className="text-[10px] uppercase">Replaced</span>
        </div>
        <div className="p-2.5 rounded-xs border border-status-warning/30 bg-status-warning/10 text-status-warning">
          <span className="block text-base font-bold">⚠{diff.summary.outlierCount}</span>
          <span className="text-[10px] uppercase">Visual Diffs</span>
        </div>
      </div>

      {/* Added Icons */}
      {diff.added.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-mono uppercase text-status-success font-bold tracking-wider">
            + Added Icons ({diff.added.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {diff.added.map((icon) => (
              <div key={icon.id} className="p-2 rounded-xs border border-status-success/30 bg-bg-elevated flex items-center gap-2">
                <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4 text-status-success" />
                <span className="text-[10px] font-mono truncate">{icon.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removed Icons */}
      {diff.removed.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-mono uppercase text-status-error font-bold tracking-wider">
            - Removed Icons ({diff.removed.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {diff.removed.map((icon) => (
              <div key={icon.id} className="p-2 rounded-xs border border-status-error/30 bg-bg-elevated flex items-center gap-2">
                <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4 text-status-error" />
                <span className="text-[10px] font-mono truncate line-through text-text-tertiary">{icon.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Replaced Icons */}
      {diff.replaced.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-mono uppercase text-accent font-bold tracking-wider">
            ↔ Replaced Concepts ({diff.replaced.length})
          </h4>
          <div className="space-y-1.5">
            {diff.replaced.map((r, i) => (
              <div key={i} className="p-2 rounded-xs border border-accent/30 bg-bg-elevated flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <IconPreviewSvg svgContent={r.original.svg} className="w-4 h-4 text-text-tertiary" />
                  <span className="line-through text-text-tertiary">{r.original.name}</span>
                  <span className="text-accent font-bold">→</span>
                  <IconPreviewSvg svgContent={r.replacement.svg} className="w-4 h-4 text-text-primary" />
                  <span className="font-semibold text-text-primary">{r.replacement.name}</span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">
                  {r.similarityScore}% match
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
