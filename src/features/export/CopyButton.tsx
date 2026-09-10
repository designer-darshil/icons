import React from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export interface CopyButtonProps {
  onCopy: () => void;
  isCopied: boolean;
  error?: string | null;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  onCopy,
  isCopied,
  error,
  label = 'Copy Code',
  size = 'md',
  variant = 'primary',
  className,
}) => {
  return (
    <Button
      type="button"
      variant={isCopied ? 'secondary' : error ? 'destructive' : variant}
      size={size}
      onClick={onCopy}
      className={cn(
        'transition-all duration-200 font-medium',
        isCopied && 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
        className
      )}
      aria-label={isCopied ? 'Code copied to clipboard' : error ? `Copy failed: ${error}` : label}
    >
      {isCopied ? (
        <>
          <Check className="w-4 h-4 mr-1.5 text-emerald-500 animate-in zoom-in duration-200" />
          <span>Copied!</span>
        </>
      ) : error ? (
        <>
          <AlertCircle className="w-4 h-4 mr-1.5 text-rose-500" />
          <span>Failed</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-1.5" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
};
