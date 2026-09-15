import React from 'react';
import type { Icon } from '@/types/icon';
import { analyzeSetConsistency } from '@/lib/icon-intelligence/consistency';
import { cn } from '@/lib/cn';

export interface IconConsistencyCheckerProps {
  icons: Icon[];
  onInspectIcon?: (iconId: string) => void;
  className?: string;
}

export const IconConsistencyChecker: React.FC<IconConsistencyCheckerProps> = ({
  icons,
  onInspectIcon,
  className,
}) => {
  const report = analyzeSetConsistency(icons);

  const metricList = Object.values(report.metrics);

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-5', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON CONSISTENCY CHECKER
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-[10px] font-mono px-2 py-0.5 rounded-3xs font-bold uppercase border',
              report.status === 'Consistent'
                ? 'bg-status-success/15 text-status-success border-status-success/30'
                : report.status === 'Warning'
                ? 'bg-status-warning/15 text-status-warning border-status-warning/30'
                : 'bg-status-error/15 text-status-error border-status-error/30'
            )}
          >
            {report.status} ({report.overallScore}/100)
          </span>
        </div>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">
        {report.summary}
      </p>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metricList.map((m) => (
          <div key={m.name} className="p-3 rounded-xs border border-border-default bg-bg-elevated/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-text-primary">{m.name}</span>
              <span
                className={cn(
                  'text-[10px] font-mono font-bold',
                  m.status === 'consistent' ? 'text-status-success' : m.status === 'warning' ? 'text-status-warning' : 'text-status-error'
                )}
              >
                {m.status === 'consistent' ? '✓ Consistent' : m.status === 'warning' ? '⚠ Warning' : '✕ Outlier'}
              </span>
            </div>
            <p className="text-[11px] text-text-tertiary font-sans leading-tight">
              {m.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Outlier Drill-Down */}
      {report.outlierIcons.length > 0 && (
        <div className="pt-3 border-t border-border-subtle/80 space-y-2">
          <h4 className="text-[11px] font-mono uppercase text-text-tertiary tracking-wider font-semibold">
            Identified Outliers ({report.outlierIcons.length})
          </h4>
          <div className="space-y-1.5">
            {report.outlierIcons.map((o) => (
              <div
                key={o.iconId}
                onClick={() => onInspectIcon?.(o.iconId)}
                className="flex items-center justify-between p-2 rounded-xs border border-border-subtle bg-bg-primary text-xs hover:border-accent cursor-pointer transition-colors"
              >
                <span className="font-mono font-medium text-text-primary">{o.iconId}</span>
                <span className="text-[10px] text-status-warning font-sans truncate max-w-[200px] sm:max-w-xs">
                  {o.reasons.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
