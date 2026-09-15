import React from 'react';
import type { Icon } from '@/types/icon';
import { calculateSetHealth } from '@/lib/icon-intelligence/health';
import { cn } from '@/lib/cn';

export interface IconSetHealthCardProps {
  icons: Icon[];
  className?: string;
}

export const IconSetHealthCard: React.FC<IconSetHealthCardProps> = ({ icons, className }) => {
  const health = calculateSetHealth(icons);

  const breakdown = [
    { label: 'Visual Consistency', score: health.breakdown.visualConsistencyScore },
    { label: 'Duplicate Prevention', score: health.breakdown.duplicateScore },
    { label: 'State Completeness', score: health.breakdown.missingStateScore },
    { label: 'Variant Homogeneity', score: health.breakdown.variantConsistencyScore },
    { label: 'Semantic Coverage', score: health.breakdown.semanticCoverageScore },
    { label: 'Category Balance', score: health.breakdown.categoryBalanceScore },
  ];

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-5', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON SET HEALTH SCORE
          </h3>
        </div>
        <span className="text-[10px] font-mono text-text-tertiary">
          {health.iconCount} concepts evaluated
        </span>
      </div>

      {/* Main Score Gauge */}
      <div className="flex items-center justify-between p-4 rounded-xs border border-border-default bg-bg-elevated/70">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-text-primary">
              {health.overallHealth}
            </span>
            <span className="text-xs font-mono text-text-tertiary">/ 100</span>
          </div>
          <p className="text-xs text-text-secondary">
            {health.outliers.length} visual outliers, {health.duplicates.length} duplicate risk(s), {health.missingCommonStates.length} missing state(s)
          </p>
        </div>

        <div className="w-12 h-12 rounded-xs border border-accent/40 bg-accent/10 flex items-center justify-center">
          <span className="text-xl font-mono font-black text-accent">{health.grade}</span>
        </div>
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-2.5">
        {breakdown.map((b) => (
          <div key={b.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-text-secondary">{b.label}</span>
              <span className="font-mono text-[11px] font-bold text-text-primary">{b.score}%</span>
            </div>
            <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden border border-border-subtle/40">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${b.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actionable Recommendations */}
      <div className="pt-3 border-t border-border-subtle/80 space-y-2">
        <h4 className="text-[11px] font-mono uppercase text-text-tertiary tracking-wider font-semibold">
          Actionable Recommendations
        </h4>
        <ul className="space-y-1.5 text-xs text-text-secondary">
          {health.actionableTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent font-bold">→</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
