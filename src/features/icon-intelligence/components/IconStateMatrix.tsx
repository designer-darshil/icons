import React from 'react';
import type { Icon } from '@/types/icon';
import { recommendIconStates } from '@/lib/icon-intelligence/state-recommender';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconStateMatrixProps {
  rootIcon: Icon;
  catalogIcons: Icon[];
  onSelectStateIcon?: (icon: Icon) => void;
  className?: string;
}

export const IconStateMatrix: React.FC<IconStateMatrixProps> = ({
  rootIcon,
  catalogIcons,
  onSelectStateIcon,
  className,
}) => {
  const matrix = recommendIconStates(rootIcon, catalogIcons);

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON STATE MATRIX
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
          Concept: {matrix.conceptFamily}
        </span>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed font-sans">
        Recommended state variations mapped to existing canonical catalog icons.
      </p>

      {/* State Matrix Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {matrix.states.map((st) => (
          <div
            key={st.stateKey}
            onClick={() => st.icon && onSelectStateIcon?.(st.icon)}
            className={cn(
              'p-3 rounded-xs border transition-all flex items-center justify-between gap-3',
              st.isAvailableInCatalog && st.icon
                ? 'border-border-default bg-bg-elevated/70 hover:border-accent/60 cursor-pointer group'
                : 'border-border-subtle/60 bg-bg-primary/40 opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs border border-border-subtle bg-bg-primary flex items-center justify-center shrink-0">
                {st.icon ? (
                  <IconPreviewSvg svgContent={st.icon.svg} className="w-4 h-4 text-text-primary" />
                ) : (
                  <span className="text-xs text-text-tertiary font-mono">—</span>
                )}
              </div>

              <div>
                <p className="text-xs font-mono font-semibold text-text-primary">{st.label}</p>
                <p className="text-[10px] text-text-tertiary truncate max-w-[140px]">
                  {st.conceptMatch}
                </p>
              </div>
            </div>

            <span
              className={cn(
                'text-[9px] font-mono px-1.5 py-0.2 rounded-3xs uppercase font-medium shrink-0',
                st.isAvailableInCatalog ? 'text-status-success bg-status-success/10' : 'text-text-tertiary'
              )}
            >
              {st.isAvailableInCatalog ? 'In Catalog' : 'Unmapped'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
