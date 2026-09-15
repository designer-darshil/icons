import React, { useState } from 'react';
import type { Icon } from '@/types/icon';
import { buildIconRelationshipGraph } from '@/lib/icon-intelligence/graph';
import { IconPreviewSvg } from '@/components/icons/IconPreviewSvg';
import { cn } from '@/lib/cn';

export interface IconRelationshipGraphViewProps {
  rootIcon: Icon;
  catalogIcons: Icon[];
  onSelectNode?: (icon: Icon) => void;
  className?: string;
}

export const IconRelationshipGraphView: React.FC<IconRelationshipGraphViewProps> = ({
  rootIcon,
  catalogIcons,
  onSelectNode,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const graphData = buildIconRelationshipGraph(rootIcon, catalogIcons, isExpanded);

  // Icon lookup helper
  const getIconById = (id: string) => catalogIcons.find((i) => i.id === id) || (id === rootIcon.id ? rootIcon : null);

  return (
    <div className={cn('p-5 rounded-sm border border-border-default bg-bg-secondary/40 space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
            ICON RELATIONSHIP GRAPH
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-xs border border-border-default bg-bg-primary hover:border-accent text-[10px] font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {isExpanded ? 'Focused Mode (6)' : 'Expanded Mode (12+)'}
          </button>
          <span className="text-[10px] font-mono text-text-tertiary">
            {graphData.nodes.length} nodes, {graphData.edges.length} edges
          </span>
        </div>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed font-sans">
        Hierarchical and semantic relationship tree connecting direct pairs, family siblings, state variations, and DNA similarity.
      </p>

      {/* Interactive Node Matrix Stage */}
      <div className="p-6 rounded-xs border border-border-default bg-bg-primary relative min-h-[300px] flex flex-col items-center justify-center">
        {/* Central Root Anchor */}
        <div className="p-3.5 rounded-sm border-2 border-accent bg-bg-secondary flex flex-col items-center space-y-1.5 shadow-dropdown z-10">
          <div className="w-10 h-10 rounded-xs bg-bg-primary border border-accent/40 flex items-center justify-center">
            <IconPreviewSvg svgContent={rootIcon.svg} className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xs font-mono font-bold text-text-primary">{rootIcon.name}</span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-accent text-accent-fg font-bold uppercase">Root Concept</span>
        </div>

        {/* Connected Relational Nodes */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
          {graphData.edges.map((edge, idx) => {
            const targetIcon = getIconById(edge.target);
            if (!targetIcon) return null;

            return (
              <div
                key={`${edge.target}-${idx}`}
                onClick={() => onSelectNode?.(targetIcon)}
                className="p-3 rounded-xs border border-border-default bg-bg-secondary/70 hover:border-accent/80 hover:bg-bg-secondary transition-all cursor-pointer group flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-3xs bg-bg-elevated text-text-tertiary uppercase font-medium">
                    {edge.relationType}
                  </span>
                  <span className="text-[9px] font-mono text-accent font-semibold">
                    {Math.round(edge.strength * 100)}%
                  </span>
                </div>

                <div className="w-9 h-9 mx-auto rounded-xs border border-border-subtle bg-bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <IconPreviewSvg svgContent={targetIcon.svg} className="w-4 h-4 text-text-primary" />
                </div>

                <div className="text-center space-y-0.5">
                  <p className="text-xs font-mono font-medium text-text-primary truncate">{targetIcon.name}</p>
                  <p className="text-[9px] text-text-tertiary truncate">{edge.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
