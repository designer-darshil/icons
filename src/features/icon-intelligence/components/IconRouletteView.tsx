import React, { useState } from 'react';
import type { Icon } from '@/types/icon';
import { spinIconRoulette } from '@/lib/icon-intelligence/roulette';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconRouletteViewProps {
  catalogIcons: Icon[];
  onOpenIcon?: (icon: Icon) => void;
  onSaveIcon?: (icon: Icon) => void;
  onCompareIcon?: (icon: Icon) => void;
  className?: string;
}

export const IconRouletteView: React.FC<IconRouletteViewProps> = ({
  catalogIcons,
  onOpenIcon,
  onSaveIcon,
  onCompareIcon,
  className,
}) => {
  const [currentCandidate, setCurrentCandidate] = useState(() => spinIconRoulette(catalogIcons));
  const [isSpinning, setIsSpinning] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setCurrentCandidate(spinIconRoulette(catalogIcons, [currentCandidate.icon.id]));
      setIsSpinning(false);
      setSavedSuccess(false);
    }, 250);
  };

  const handleSave = () => {
    onSaveIcon?.(currentCandidate.icon);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const icon = currentCandidate.icon;

  return (
    <div className={cn('p-6 rounded-sm border border-border-default bg-bg-secondary/40 space-y-6 text-center max-w-lg mx-auto', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON ROULETTE — SURPRISE ME
          </h3>
        </div>
        <span className="text-[10px] font-mono text-text-tertiary">
          Serendipitous Discovery
        </span>
      </div>

      {/* Featured Icon Stage */}
      <div className="relative py-4">
        <div
          className={cn(
            'w-24 h-24 mx-auto rounded-sm border border-border-strong bg-bg-primary flex items-center justify-center shadow-dropdown transition-all duration-300',
            isSpinning ? 'scale-90 rotate-12 opacity-50' : 'scale-100 rotate-0 opacity-100'
          )}
        >
          <IconPreviewSvg svgContent={icon.svg} className="w-12 h-12 text-accent" />
        </div>

        <div className="mt-4 space-y-1">
          <h4 className="text-base font-mono font-bold text-text-primary uppercase tracking-wide">{icon.name}</h4>
          <p className="text-xs text-text-tertiary font-mono">
            {icon.category} // {icon.slug}
          </p>
        </div>

        <p className="mt-3 text-xs text-text-secondary font-sans max-w-md mx-auto leading-relaxed">
          {currentCandidate.surprisingFact}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap pt-2 border-t border-border-subtle/80">
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="px-4 py-2 rounded-sm bg-accent text-accent-fg hover:bg-accent-hover active:scale-98 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-all"
        >
          {isSpinning ? 'Spinning...' : '🎲 Spin Another'}
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-3.5 py-2 rounded-sm border border-border-default bg-bg-secondary hover:bg-bg-elevated text-xs font-mono font-semibold uppercase tracking-wider text-text-primary cursor-pointer transition-colors"
        >
          {savedSuccess ? '✓ Saved' : '★ Save'}
        </button>

        <button
          type="button"
          onClick={() => onCompareIcon?.(icon)}
          className="px-3.5 py-2 rounded-sm border border-border-default bg-bg-secondary hover:bg-bg-elevated text-xs font-mono font-semibold uppercase tracking-wider text-text-primary cursor-pointer transition-colors"
        >
          ⚖ Compare
        </button>

        <button
          type="button"
          onClick={() => onOpenIcon?.(icon)}
          className="px-3.5 py-2 rounded-sm border border-border-default bg-bg-secondary hover:bg-bg-elevated text-xs font-mono font-semibold uppercase tracking-wider text-text-primary cursor-pointer transition-colors"
        >
          ↗ Open Detail
        </button>
      </div>
    </div>
  );
};
