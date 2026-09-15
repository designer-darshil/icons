import React from 'react';
import type { Icon } from '@/types/icon';
import { detectMissingIcons } from '@/lib/icon-intelligence/missing-detector';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface MissingIconDetectorProps {
  currentIcons: Icon[];
  catalogIcons: Icon[];
  onAddIcon?: (icon: Icon) => void;
  className?: string;
}

export const MissingIconDetector: React.FC<MissingIconDetectorProps> = ({
  currentIcons,
  catalogIcons,
  onAddIcon,
  className,
}) => {
  const report = detectMissingIcons(currentIcons, catalogIcons);

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            MISSING ICON DETECTOR
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
          {report.totalSuggested} suggested concepts
        </span>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed font-sans">
        Identified domain gaps based on {report.detectedCategoryPatterns.join(', ') || 'general UI workflows'}.
      </p>

      {/* Suggested Concept Cards */}
      <div className="space-y-3">
        {report.suggestions.map((sug) => (
          <div
            key={sug.concept}
            className="p-3.5 rounded-xs border border-border-default bg-bg-elevated/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-text-primary">{sug.concept}</span>
                <span
                  className={cn(
                    'text-[9px] font-mono px-1.5 py-0.2 rounded-3xs font-semibold uppercase',
                    sug.tier === 'Recommended'
                      ? 'bg-status-success/15 text-status-success border border-status-success/30'
                      : sug.tier === 'Possible'
                      ? 'bg-accent/15 text-accent border border-accent/30'
                      : 'bg-bg-secondary text-text-tertiary border border-border-default'
                  )}
                >
                  {sug.tier}
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary font-sans">{sug.reason}</p>
            </div>

            {/* Catalog candidates */}
            <div className="flex items-center gap-2 shrink-0">
              {sug.matchingCatalogIcons.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => onAddIcon?.(icon)}
                  title={`Add ${icon.name} to set`}
                  className="p-1.5 rounded-xs border border-border-default bg-bg-primary hover:border-accent hover:bg-bg-secondary transition-colors cursor-pointer group flex items-center gap-1.5"
                >
                  <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4 text-text-primary" />
                  <span className="text-[10px] font-mono text-text-secondary group-hover:text-text-primary">
                    + Add
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {report.suggestions.length === 0 && (
        <div className="p-8 text-center border border-dashed border-border-default rounded-sm text-text-tertiary text-xs">
          No critical domain gaps detected. Your icon set has comprehensive core coverage.
        </div>
      )}
    </div>
  );
};
