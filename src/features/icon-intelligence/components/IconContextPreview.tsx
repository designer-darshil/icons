import React, { useState } from 'react';
import type { Icon } from '@/types/icon';
import { UI_CONTEXT_SPECS } from '@/lib/icon-intelligence/context-preview';
import type { UIContextKey } from '@/types/intelligence';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconContextPreviewProps {
  icon: Icon;
  className?: string;
}

export const IconContextPreview: React.FC<IconContextPreviewProps> = ({ icon, className }) => {
  const [activeContext, setActiveContext] = useState<UIContextKey>('button');
  const contextKeys = Object.keys(UI_CONTEXT_SPECS) as UIContextKey[];

  const currentSpec = UI_CONTEXT_SPECS[activeContext];

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            REAL-WORLD UI CONTEXT PREVIEW
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-3xs bg-bg-elevated border border-border-default text-text-tertiary">
          Rec Size: {currentSpec.recommendedSize}px
        </span>
      </div>

      {/* Context Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {contextKeys.map((key) => {
          const spec = UI_CONTEXT_SPECS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveContext(key)}
              className={cn(
                'px-2.5 py-1 rounded-xs text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border',
                activeContext === key
                  ? 'bg-accent text-accent-fg border-accent font-bold shadow-2xs'
                  : 'bg-bg-primary text-text-tertiary border-border-default hover:text-text-primary hover:border-border-strong'
              )}
            >
              {spec.title}
            </button>
          );
        })}
      </div>

      {/* Context Rendering Stage */}
      <div className="p-8 rounded-xs border border-border-default bg-bg-primary min-h-[160px] flex items-center justify-center">
        {activeContext === 'button' && (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-accent text-accent-fg text-xs font-medium cursor-pointer shadow-xs">
              <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4" />
              <span>{icon.name}</span>
            </button>
            <button type="button" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm border border-border-default bg-bg-secondary text-text-primary text-xs font-medium cursor-pointer hover:bg-bg-elevated">
              <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4 text-text-secondary" />
              <span>Secondary Action</span>
            </button>
            <button type="button" aria-label={icon.name} className="p-2 rounded-sm border border-border-default bg-bg-secondary text-text-primary hover:border-accent cursor-pointer">
              <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeContext === 'toolbar' && (
          <div className="inline-flex items-center gap-1 p-1 rounded-sm border border-border-default bg-bg-secondary shadow-xs">
            <div className="p-1.5 rounded-xs bg-bg-elevated text-accent border border-accent/40">
              <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4" />
            </div>
            <div className="p-1.5 rounded-xs text-text-tertiary hover:text-text-primary cursor-pointer">
              <span className="w-4 h-4 block rounded-xs border border-dashed border-border-strong" />
            </div>
            <div className="p-1.5 rounded-xs text-text-tertiary hover:text-text-primary cursor-pointer">
              <span className="w-4 h-4 block rounded-xs border border-dashed border-border-strong" />
            </div>
          </div>
        )}

        {activeContext === 'navigation' && (
          <div className="w-64 p-2 rounded-sm border border-border-default bg-bg-secondary space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xs bg-accent/15 text-accent border border-accent/30 font-medium text-xs">
              <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4 shrink-0" />
              <span className="font-mono text-xs">{icon.name}</span>
              <span className="ml-auto text-[9px] bg-accent text-accent-fg px-1.5 py-0.2 rounded-full font-mono font-bold">12</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xs text-text-tertiary text-xs">
              <span className="w-4 h-4 block rounded-xs border border-dashed border-border-subtle" />
              <span className="font-mono text-xs">Documentation</span>
            </div>
          </div>
        )}

        {activeContext === 'input' && (
          <div className="w-72 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4" />
            </div>
            <input
              type="text"
              readOnly
              value={`Query ${icon.name.toLowerCase()} parameters...`}
              className="w-full pl-9 pr-3 py-2 rounded-sm border border-border-default bg-bg-secondary text-xs text-text-primary font-mono select-none"
            />
          </div>
        )}

        {activeContext === 'table' && (
          <div className="w-full max-w-md border border-border-default rounded-sm overflow-hidden bg-bg-secondary text-xs">
            <div className="px-3 py-2 border-b border-border-default bg-bg-elevated font-mono text-[10px] text-text-tertiary uppercase flex justify-between">
              <span>Concept Record</span>
              <span>Action</span>
            </div>
            <div className="px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4 text-accent" />
                <span className="font-mono">{icon.slug}</span>
              </div>
              <span className="text-[10px] font-mono text-text-tertiary">Active</span>
            </div>
          </div>
        )}

        {activeContext === 'dropdown' && (
          <div className="w-56 p-1.5 rounded-sm border border-border-default bg-bg-secondary shadow-dropdown space-y-0.5 text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xs bg-bg-elevated text-text-primary">
              <div className="flex items-center gap-2.5">
                <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4 text-accent" />
                <span className="font-medium">{icon.name}</span>
              </div>
              <span className="text-[10px] font-mono text-text-tertiary">⌘K</span>
            </div>
            <div className="flex items-center justify-between px-2.5 py-1.5 text-text-tertiary">
              <span>Duplicate Record</span>
              <span className="text-[10px] font-mono">⌘D</span>
            </div>
          </div>
        )}

        {activeContext === 'empty-state' && (
          <div className="text-center space-y-2 max-w-xs">
            <div className="w-14 h-14 mx-auto rounded-sm border border-border-default bg-bg-secondary flex items-center justify-center text-text-primary shadow-xs">
              <IconPreviewSvg svgContent={icon.svg} className="w-7 h-7 text-accent" />
            </div>
            <h4 className="text-xs font-mono font-bold text-text-primary uppercase">No {icon.name} Found</h4>
            <p className="text-[11px] text-text-tertiary font-sans">
              Create your first {icon.name.toLowerCase()} or calibrate existing filters.
            </p>
          </div>
        )}

        {activeContext === 'notification' && (
          <div className="max-w-sm p-3.5 rounded-sm border border-accent/40 bg-accent/5 flex items-start gap-3 text-xs shadow-dropdown">
            <div className="p-1 rounded-xs bg-accent text-accent-fg shrink-0 mt-0.5">
              <IconPreviewSvg svgContent={icon.svg} className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <p className="font-mono font-bold text-text-primary text-xs">{icon.name} Alert</p>
              <p className="text-[11px] text-text-secondary font-sans leading-tight">
                System state event calibrated successfully with 24×24 vector metrics.
              </p>
            </div>
          </div>
        )}

        {activeContext === 'card-header' && (
          <div className="w-72 p-4 rounded-sm border border-border-default bg-bg-secondary space-y-2">
            <div className="flex items-center justify-between border-b border-border-subtle/80 pb-2">
              <div className="flex items-center gap-2">
                <IconPreviewSvg svgContent={icon.svg} className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-bold uppercase">{icon.name}</span>
              </div>
              <span className="text-[10px] font-mono text-text-tertiary">№ 02</span>
            </div>
            <div className="text-lg font-mono font-black text-text-primary">2,200 DP</div>
          </div>
        )}

        {activeContext === 'badge' && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 text-[10px] font-mono font-semibold">
              <IconPreviewSvg svgContent={icon.svg} className="w-3 h-3" />
              <span>{icon.name}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-bg-secondary text-text-secondary border border-border-default text-[10px] font-mono">
              <IconPreviewSvg svgContent={icon.svg} className="w-3 h-3" />
              <span>Verified</span>
            </span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-text-tertiary font-sans text-center">
        {currentSpec.description}
      </p>
    </div>
  );
};
