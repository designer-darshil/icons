import React from 'react';
import { Download, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export interface DownloadButtonProps {
  onDownload: () => void;
  isDownloaded: boolean;
  error?: string | null;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  onDownload,
  isDownloaded,
  error,
  label = 'Download SVG',
  size = 'md',
  variant = 'secondary',
  className,
}) => {
  return (
    <Button
      type="button"
      variant={isDownloaded ? 'secondary' : error ? 'destructive' : variant}
      size={size}
      onClick={onDownload}
      className={cn(
        'transition-all duration-200 font-medium',
        isDownloaded && 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
        className
      )}
      aria-label={isDownloaded ? 'SVG downloaded' : error ? `Download failed: ${error}` : label}
    >
      {isDownloaded ? (
        <>
          <Check className="w-4 h-4 mr-1.5 text-emerald-500 animate-in zoom-in duration-200" />
          <span>Downloaded!</span>
        </>
      ) : error ? (
        <>
          <AlertCircle className="w-4 h-4 mr-1.5 text-rose-500" />
          <span>Failed</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-1.5" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
};
