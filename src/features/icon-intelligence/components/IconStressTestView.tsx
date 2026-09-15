import React from 'react';
import type { Icon } from '@/types/icon';
import { evaluateIconStressTest } from '@/lib/icon-intelligence/stress-test';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconStressTestViewProps {
  icon: Icon;
  className?: string;
}

export const IconStressTestView: React.FC<IconStressTestViewProps> = ({ icon, className }) => {
  const report = evaluateIconStressTest(icon);

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-5', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            PIXEL SIZE STRESS TEST (12PX – 64PX)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
          Optimal: {report.recommendedMinSize}px – {report.recommendedMaxSize}px
        </span>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed font-sans">
        Inspect optical density, stroke fidelity, and curve clumping across standard interface scale steps.
      </p>

      {/* Stress Scale Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {report.evaluations.map((ev) => (
          <div
            key={ev.size}
            className="p-3.5 rounded-xs border border-border-default bg-bg-elevated/70 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-text-primary">{ev.size}px</span>
              <span
                className={cn(
                  'text-[9px] font-mono px-1.5 py-0.2 rounded-3xs font-semibold uppercase',
                  ev.status === 'Good'
                    ? 'bg-status-success/15 text-status-success border border-status-success/30'
                    : ev.status === 'Caution'
                    ? 'bg-status-warning/15 text-status-warning border border-status-warning/30'
                    : 'bg-status-error/15 text-status-error border border-status-error/30'
                )}
              >
                {ev.status}
              </span>
            </div>

            {/* Visual Rendering Box */}
            <div className="h-20 rounded-xs border border-border-subtle bg-bg-primary flex items-center justify-center p-2">
              <div style={{ width: ev.size, height: ev.size }}>
                <IconPreviewSvg svgContent={icon.svg} className="w-full h-full text-text-primary" />
              </div>
            </div>

            <div className="space-y-1 text-center">
              <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                <span>Density: {ev.apparentDensity}</span>
                <span>Score: {ev.legibilityScore}%</span>
              </div>
              <p className="text-[10px] text-text-secondary font-sans leading-tight text-left line-clamp-2">
                {ev.notes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
