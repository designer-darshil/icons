import React, { useState } from 'react';
import type { Icon } from '@/types/icon';
import { findSimilarIcons } from '@/lib/icon-intelligence/similarity';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconSimilarityPanelProps {
  targetIcon: Icon;
  catalogIcons: Icon[];
  onSelectIcon?: (icon: Icon) => void;
  className?: string;
}

export const IconSimilarityPanel: React.FC<IconSimilarityPanelProps> = ({
  targetIcon,
  catalogIcons,
  onSelectIcon,
  className,
}) => {
  const [filterTier, setFilterTier] = useState<string>('all');
  const results = findSimilarIcons(targetIcon, catalogIcons, 16);

  const filteredResults = results.filter((r) => {
    if (filterTier === 'all') return true;
    return r.matchTier.toLowerCase() === filterTier.toLowerCase();
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            FIND AN ICON LIKE THIS
          </h3>
          <p className="text-xs text-text-tertiary">
            Multi-factor visual silhouette, path density, and semantic analysis.
          </p>
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1 bg-bg-secondary p-1 rounded-sm border border-border-default">
          {['all', 'Most similar', 'Related', 'Loosely similar'].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setFilterTier(tier)}
              className={cn(
                'px-2.5 py-1 rounded-xs text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer',
                filterTier.toLowerCase() === tier.toLowerCase()
                  ? 'bg-accent text-accent-fg font-bold shadow-2xs'
                  : 'text-text-tertiary hover:text-text-primary'
              )}
            >
              {tier === 'all' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredResults.map(({ icon, similarityScore, matchTier, matchedFactors }) => (
          <div
            key={icon.id}
            onClick={() => onSelectIcon?.(icon)}
            className="p-3.5 rounded-sm border border-border-default bg-bg-secondary/40 hover:bg-bg-secondary hover:border-accent/60 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'text-[9px] font-mono px-1.5 py-0.5 rounded-3xs font-semibold uppercase',
                  matchTier === 'Most similar'
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'bg-bg-elevated text-text-tertiary border border-border-default'
                )}
              >
                {matchTier}
              </span>
              <span className="text-[10px] font-mono text-text-tertiary font-bold">
                {similarityScore}%
              </span>
            </div>

            <div className="w-12 h-12 mx-auto rounded-xs border border-border-subtle bg-bg-primary flex items-center justify-center text-text-primary group-hover:scale-105 transition-transform">
              <IconPreviewSvg svgContent={icon.svg} className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs font-mono font-medium text-text-primary truncate">{icon.name}</p>
              <p className="text-[10px] text-text-tertiary truncate leading-none">
                {matchedFactors[0] || icon.category}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="p-8 text-center border border-dashed border-border-default rounded-sm text-text-tertiary text-xs">
          No icons matching the selected similarity tier.
        </div>
      )}
    </div>
  );
};
