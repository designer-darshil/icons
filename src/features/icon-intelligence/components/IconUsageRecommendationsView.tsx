import React from 'react';
import type { Icon } from '@/types/icon';
import { generateUsageGuidelines } from '@/lib/icon-intelligence/recommendations';
import { cn } from '@/lib/cn';

export interface IconUsageRecommendationsViewProps {
  icon: Icon;
  className?: string;
}

export const IconUsageRecommendationsView: React.FC<IconUsageRecommendationsViewProps> = ({
  icon,
  className,
}) => {
  const guide = generateUsageGuidelines(icon);

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON USAGE RECOMMENDATIONS
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
          Design Heuristics
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Recommended Sizing */}
        <div className="p-3.5 rounded-xs border border-border-default bg-bg-elevated/70 space-y-1">
          <span className="text-[10px] font-mono text-text-tertiary uppercase font-bold">Recommended Scale</span>
          <p className="text-xs font-mono font-bold text-text-primary">{guide.recommendedSizes}</p>
          <p className="text-[11px] text-text-secondary font-sans leading-tight">
            Optimal stroke width: {guide.optimalStrokeWidth}px on 24×24dp canvas.
          </p>
        </div>

        {/* Optical Placement */}
        <div className="p-3.5 rounded-xs border border-border-default bg-bg-elevated/70 space-y-1">
          <span className="text-[10px] font-mono text-text-tertiary uppercase font-bold">Optical Alignment</span>
          <p className="text-[11px] text-text-secondary font-sans leading-tight">
            {guide.opticalPlacementNotes}
          </p>
        </div>
      </div>

      {/* Best Use Cases */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-mono uppercase text-status-success font-bold tracking-wider">
          ✓ Ideal Interface Contexts
        </h4>
        <ul className="space-y-1 text-xs text-text-secondary font-sans">
          {guide.bestUseCases.map((uc, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-status-success font-bold">✓</span>
              <span>{uc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Avoid Anti-Patterns */}
      <div className="space-y-2 pt-2 border-t border-border-subtle/80">
        <h4 className="text-[11px] font-mono uppercase text-status-warning font-bold tracking-wider">
          ⚠ Avoided Anti-Patterns
        </h4>
        <ul className="space-y-1 text-xs text-text-secondary font-sans">
          {guide.avoidUseCases.map((auc, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-status-warning font-bold">✕</span>
              <span>{auc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
