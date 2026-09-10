import React, { useMemo } from 'react';
import { CopyButton } from './CopyButton';
import { cn } from '@/lib/cn';

export interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  sizeBytes?: number;
  isCopied: boolean;
  onCopy: () => void;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  filename,
  sizeBytes,
  isCopied,
  onCopy,
  className,
}) => {
  const lines = useMemo(() => code.split('\n'), [code]);

  const formattedSize = useMemo(() => {
    if (!sizeBytes) return null;
    if (sizeBytes < 1024) return `${sizeBytes} B`;
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }, [sizeBytes]);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border border-border/80 bg-surface-subtle/80 dark:bg-zinc-950 overflow-hidden font-mono text-xs shadow-inner',
        className
      )}
    >
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/60 bg-surface-muted/50 dark:bg-zinc-900/80 backdrop-blur-sm select-none">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Mac-style subtle window dots */}
          <div className="flex items-center gap-1.5 mr-1.5 opacity-60">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          {filename && (
            <span className="font-mono text-[11px] font-medium text-foreground truncate max-w-[180px] sm:max-w-[240px]">
              {filename}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface/80 text-foreground-muted border border-border/40 uppercase tracking-wider font-semibold">
              {language}
            </span>
            {formattedSize && (
              <span className="text-[10px] text-foreground-subtle hidden sm:inline-block">
                {formattedSize}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton
            onCopy={onCopy}
            isCopied={isCopied}
            size="sm"
            variant="ghost"
            label="Copy"
            className="h-7 px-2.5 text-xs"
          />
        </div>
      </div>

      {/* Code Block Content with Line Numbers */}
      <div className="relative overflow-x-auto max-h-[260px] sm:max-h-[300px] p-3 text-left scrollbar-thin scrollbar-thumb-border">
        <pre className="flex leading-relaxed font-mono">
          {/* Line Numbers */}
          <div
            aria-hidden="true"
            className="flex flex-col text-right select-none text-foreground-subtle/50 pr-3 mr-3 border-r border-border/30"
          >
            {lines.map((_, i) => (
              <span key={i} className="text-[11px]">
                {i + 1}
              </span>
            ))}
          </div>

          {/* Actual Code */}
          <code className="text-[11.5px] text-foreground/90 whitespace-pre font-mono block w-full">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
