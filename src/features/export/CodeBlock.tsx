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
        'relative flex flex-col rounded-xs border border-border-default bg-bg-secondary overflow-hidden font-mono text-xs',
        className
      )}
    >
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-border-subtle bg-bg-elevated select-none">
        <div className="flex items-center gap-2 overflow-hidden">
          {filename && (
            <span className="font-mono text-[11px] font-medium text-text-primary truncate max-w-[180px] sm:max-w-[240px]">
              {filename}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded-3xs bg-bg-secondary text-text-tertiary border border-border-subtle uppercase tracking-wider font-semibold">
              {language}
            </span>
            {formattedSize && (
              <span className="text-[10px] text-text-tertiary hidden sm:inline-block">
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
            className="h-6 px-2 text-[11px]"
          />
        </div>
      </div>

      {/* Code Block Content with Line Numbers */}
      <div
        data-lenis-prevent="true"
        className="relative overflow-auto max-h-[260px] sm:max-h-[300px] p-3 text-left native-scroll overscroll-contain select-text"
      >
        <pre className="flex leading-relaxed font-mono select-text">
          {/* Line Numbers */}
          <div
            aria-hidden="true"
            className="flex flex-col text-right select-none text-text-tertiary/60 pr-3 mr-3 border-r border-border-subtle shrink-0"
          >
            {lines.map((_, i) => (
              <span key={i} className="text-[11px]">
                {i + 1}
              </span>
            ))}
          </div>

          {/* Actual Code */}
          <code className="text-[11.5px] text-text-primary whitespace-pre font-mono block select-text">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
