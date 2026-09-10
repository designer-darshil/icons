import React from 'react';
import { Icon, IconVariant } from '@/types/icon';
import { IconCustomization } from '@/types/customization';
import { useExport } from './useExport';
import { ExportTabs, EXPORT_FORMATS } from './ExportTabs';
import { CodeBlock } from './CodeBlock';
import { CopyButton } from './CopyButton';
import { DownloadButton } from './DownloadButton';
import { FileCode, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ExportPanelProps {
  icon: Icon;
  variant: IconVariant;
  customization: IconCustomization;
  className?: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  icon,
  variant,
  customization,
  className,
}) => {
  const {
    format,
    setFormat,
    result,
    isCopied,
    isDownloaded,
    copyError,
    downloadError,
    handleCopy,
    handleDownload,
  } = useExport(icon, variant, customization);

  const currentFormatMeta = EXPORT_FORMATS.find((f) => f.id === format);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-sm',
        className
      )}
    >
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/10 text-brand-500">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-1.5">
              <span>Code Export</span>
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-2.5 h-2.5" />
                Live
              </span>
            </h3>
            <p className="text-xs text-foreground-muted">
              {currentFormatMeta?.description || 'Export customized vector output'}
            </p>
          </div>
        </div>

        {/* Format Selector Tabs */}
        <ExportTabs activeFormat={format} onChangeFormat={setFormat} />
      </div>

      {/* Code Block */}
      <div
        id={`panel-export-${format}`}
        role="tabpanel"
        aria-labelledby={`tab-export-${format}`}
        className="w-full"
      >
        <CodeBlock
          code={result.code}
          language={result.language}
          filename={result.filename}
          sizeBytes={result.sizeBytes}
          isCopied={isCopied}
          onCopy={handleCopy}
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        <div className="text-xs text-foreground-subtle hidden sm:block">
          Outputs reflect active style, colors, strokes, and transforms.
        </div>

        <div className="flex items-center gap-2 justify-end">
          <DownloadButton
            onDownload={handleDownload}
            isDownloaded={isDownloaded}
            error={downloadError}
            variant="outline"
            className="flex-1 sm:flex-none justify-center h-9"
          />
          <CopyButton
            onCopy={handleCopy}
            isCopied={isCopied}
            error={copyError}
            variant="primary"
            label={`Copy ${currentFormatMeta?.label || 'Code'}`}
            className="flex-1 sm:flex-none justify-center h-9 shadow-sm"
          />
        </div>
      </div>

      {/* Accessible Live Feedback Announcer */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isCopied && `${currentFormatMeta?.label} code copied to clipboard successfully`}
        {isDownloaded && `Customized SVG file ${result.filename} downloaded successfully`}
        {copyError && `Copying failed: ${copyError}`}
        {downloadError && `Download failed: ${downloadError}`}
      </div>
    </div>
  );
};
