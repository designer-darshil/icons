import React from 'react';
import { ExportFormat, ExportFormatOption } from '@/types/export';
import { cn } from '@/lib/cn';

export interface ExportTabsProps {
  activeFormat: ExportFormat;
  onChangeFormat: (format: ExportFormat) => void;
}

export const EXPORT_FORMATS: ExportFormatOption[] = [
  {
    id: 'svg',
    label: 'SVG',
    language: 'xml',
    description: 'Raw SVG markup ready to paste or embed',
  },
  {
    id: 'react',
    label: 'React',
    language: 'typescript',
    description: 'TypeScript JSX component with size and color props',
    badge: 'TSX',
  },
  {
    id: 'html',
    label: 'HTML',
    language: 'html',
    description: 'HTML snippet for static web pages',
  },
  {
    id: 'data-uri',
    label: 'Data URI',
    language: 'text',
    description: 'URL-encoded base data URI for img src or CSS',
  },
  {
    id: 'css',
    label: 'CSS Mask',
    language: 'css',
    description: 'Pure CSS background mask utility class',
  },
];

export const ExportTabs: React.FC<ExportTabsProps> = ({
  activeFormat,
  onChangeFormat,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Export format selection"
      className="flex items-center gap-1 p-1 bg-surface-muted/70 dark:bg-surface-subtle/50 rounded-lg border border-border/50 overflow-x-auto no-scrollbar"
    >
      {EXPORT_FORMATS.map((fmt) => {
        const isActive = activeFormat === fmt.id;
        return (
          <button
            key={fmt.id}
            role="tab"
            type="button"
            id={`tab-export-${fmt.id}`}
            aria-selected={isActive}
            aria-controls={`panel-export-${fmt.id}`}
            onClick={() => onChangeFormat(fmt.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              isActive
                ? 'bg-surface text-foreground shadow-xs font-semibold border border-border/60'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-muted/50'
            )}
          >
            <span>{fmt.label}</span>
            {fmt.badge && (
              <span
                className={cn(
                  'text-[10px] px-1 py-0.2 rounded font-mono uppercase tracking-wider',
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                    : 'bg-surface-subtle text-foreground-subtle'
                )}
              >
                {fmt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
