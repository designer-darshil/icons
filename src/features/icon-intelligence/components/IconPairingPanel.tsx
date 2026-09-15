import React from 'react';
import type { Icon } from '@/types/icon';
import { findIconPairings } from '@/lib/icon-intelligence/pairing';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconPairingPanelProps {
  icon: Icon;
  catalogIcons: Icon[];
  onSelectPair?: (icon: Icon) => void;
  className?: string;
}

export const IconPairingPanel: React.FC<IconPairingPanelProps> = ({
  icon,
  catalogIcons,
  onSelectPair,
  className,
}) => {
  const report = findIconPairings(icon, catalogIcons);

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON PAIRING INTELLIGENCE
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
          Direct Pairs & Companions
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {report.pairings.map((pair) => (
          <div
            key={pair.pairedIcon.id}
            onClick={() => onSelectPair?.(pair.pairedIcon)}
            className="p-3.5 rounded-xs border border-border-default bg-bg-elevated/70 hover:border-accent/60 transition-all cursor-pointer group flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xs border border-border-subtle bg-bg-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <IconPreviewSvg svgContent={pair.pairedIcon.svg} className="w-5 h-5 text-text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-mono font-semibold text-text-primary">{pair.pairedIcon.name}</p>
                <p className="text-[10px] text-text-tertiary">{pair.relationLabel}</p>
              </div>
            </div>

            <span
              className={cn(
                'text-[9px] font-mono px-1.5 py-0.2 rounded-3xs uppercase font-semibold shrink-0',
                pair.type === 'Direct pair'
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'bg-bg-secondary text-text-tertiary border border-border-default'
              )}
            >
              {pair.type}
            </span>
          </div>
        ))}
      </div>

      {report.pairings.length === 0 && (
        <div className="p-8 text-center border border-dashed border-border-default rounded-sm text-text-tertiary text-xs">
          No direct counterpart pairs registered for this concept.
        </div>
      )}
    </div>
  );
};
