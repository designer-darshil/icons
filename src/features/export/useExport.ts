import { useState, useMemo, useCallback } from 'react';
import { ExportFormat, ExportResult } from '@/types/export';
import { Icon, IconVariant } from '@/types/icon';
import { IconCustomization } from '@/types/customization';
import { generateExport } from '@/lib/export-formatters';
import { copyToClipboard, downloadFile } from '@/lib/export-svg';
import { useToast } from '@/components/ui/Toast';

export interface UseExportReturn {
  format: ExportFormat;
  setFormat: (format: ExportFormat) => void;
  result: ExportResult;
  isCopied: boolean;
  isDownloaded: boolean;
  copyError: string | null;
  downloadError: string | null;
  handleCopy: () => Promise<boolean>;
  handleDownload: () => boolean;
}

export function useExport(
  icon: Icon,
  variant: IconVariant,
  customization: IconCustomization
): UseExportReturn {
  const [format, setFormat] = useState<ExportFormat>('svg');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { success, error } = useToast();

  // Compute export code reactively whenever icon, variant, customization, or format changes
  const result = useMemo(() => {
    return generateExport(format, icon, variant, customization);
  }, [format, icon, variant, customization]);

  const handleCopy = useCallback(async (): Promise<boolean> => {
    setCopyError(null);
    try {
      const ok = await copyToClipboard(result.code);
      if (ok) {
        setIsCopied(true);
        success(`Copied ${format.toUpperCase()} snippet to clipboard!`);
        setTimeout(() => setIsCopied(false), 2000);
        return true;
      } else {
        const msg = 'Unable to access clipboard';
        setCopyError(msg);
        error(msg);
        setTimeout(() => setCopyError(null), 3000);
        return false;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Copy failed';
      setCopyError(msg);
      error(msg);
      setTimeout(() => setCopyError(null), 3000);
      return false;
    }
  }, [result.code, format, success, error]);

  const handleDownload = useCallback((): boolean => {
    setDownloadError(null);
    try {
      // For download, always download the formatted SVG asset
      const svgResult = generateExport('svg', icon, variant, customization);
      const ok = downloadFile(svgResult.code, svgResult.filename, svgResult.mimeType);
      if (ok) {
        setIsDownloaded(true);
        success(`Downloaded ${svgResult.filename}`);
        setTimeout(() => setIsDownloaded(false), 2000);
        return true;
      } else {
        const msg = 'Download failed to start';
        setDownloadError(msg);
        error(msg);
        setTimeout(() => setDownloadError(null), 3000);
        return false;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Download failed';
      setDownloadError(msg);
      error(msg);
      setTimeout(() => setDownloadError(null), 3000);
      return false;
    }
  }, [icon, variant, customization, success, error]);

  return {
    format,
    setFormat,
    result,
    isCopied,
    isDownloaded,
    copyError,
    downloadError,
    handleCopy,
    handleDownload,
  };
}
