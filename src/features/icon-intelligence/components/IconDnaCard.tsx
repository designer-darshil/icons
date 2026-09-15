import React from 'react';
import type { Icon } from '@/types/icon';
import { calculateIconDna } from '@/lib/icon-intelligence/dna';
import { cn } from '@/lib/cn';

export interface IconDnaCardProps {
  icon: Icon;
  className?: string;
}

export const IconDnaCard: React.FC<IconDnaCardProps> = ({ icon, className }) => {
  const dna = calculateIconDna(icon);

  const metrics: { label: string; score: number; max: number; note: string }[] = [
    { label: 'Visual Weight', score: dna.weight, max: 5, note: dna.weight >= 4 ? 'Heavy / Solid' : dna.weight <= 2 ? 'Light' : 'Regular (2px)' },
    { label: 'Roundness', score: dna.roundness, max: 5, note: dna.roundness >= 4 ? 'Curvilinear' : dna.roundness <= 2 ? 'Rectilinear' : 'Balanced' },
    { label: 'Density', score: dna.density, max: 5, note: dna.density >= 4 ? 'Dense paths' : dna.density <= 2 ? 'Airy' : 'Standard' },
    { label: 'Symmetry', score: dna.symmetry, max: 5, note: dna.symmetry >= 4 ? 'Symmetrical' : 'Asymmetrical' },
    { label: 'Complexity', score: dna.complexity, max: 5, note: dna.complexity >= 4 ? 'Multi-element' : 'Minimal' },
    { label: 'Visual Balance', score: dna.visualBalance, max: 5, note: 'Center aligned' },
  ];

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON DNA PROFILE
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
          Heuristic Calibration
        </span>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed font-sans">
        {dna.heuristicSummary}
      </p>

      <div className="space-y-2.5 pt-1">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between text-xs">
            <span className="text-text-secondary font-mono text-[11px] w-28 shrink-0">{m.label}</span>
            <div className="flex items-center gap-1.5 flex-1 max-w-[120px] mx-3">
              {Array.from({ length: m.max }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i < m.score ? 'bg-accent shadow-2xs' : 'bg-border-default'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-text-tertiary text-right shrink-0">
              {m.note}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border-subtle/60 text-center text-[10px] font-mono text-text-tertiary">
        <div className="p-1.5 rounded-3xs bg-bg-elevated border border-border-subtle/60">
          <span className="block text-text-primary font-bold">{dna.pathCount}</span>
          <span>Paths</span>
        </div>
        <div className="p-1.5 rounded-3xs bg-bg-elevated border border-border-subtle/60">
          <span className="block text-text-primary font-bold">{dna.cornerTreatment}</span>
          <span>Corners</span>
        </div>
        <div className="p-1.5 rounded-3xs bg-bg-elevated border border-border-subtle/60">
          <span className="block text-text-primary font-bold">{dna.apparentOpticalSize}</span>
          <span>Optical Size</span>
        </div>
      </div>
    </div>
  );
};
