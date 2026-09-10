import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { copyToClipboard } from '@/lib/export-svg';
import {
  generateSvgSnippet,
  generateReactJsx,
  generateHtmlSnippet,
  generateDataUri,
  generateCssMaskSnippet,
} from '@/lib/export-formatters';
import type { Icon, IconVariant } from '@/types/icon';
import type { IconCustomization } from '@/types/customization';
import { Copy, Check, Code } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: Icon;
  variant: IconVariant;
  customization: IconCustomization;
}

type CodeFormat = 'jsx' | 'svg' | 'html' | 'css' | 'data-uri';

const FORMATS: { id: CodeFormat; label: string }[] = [
  { id: 'jsx', label: 'React JSX' },
  { id: 'svg', label: 'SVG' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS Mask' },
  { id: 'data-uri', label: 'Data URI' },
];

export const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  icon,
  variant,
  customization,
}) => {
  const [activeFormat, setActiveFormat] = useState<CodeFormat>('jsx');
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const formattedCode = useMemo(() => {
    switch (activeFormat) {
      case 'jsx':
        return generateReactJsx(icon, variant, customization);
      case 'svg':
        return generateSvgSnippet(variant, customization);
      case 'html':
        return generateHtmlSnippet(icon, variant, customization);
      case 'css':
        return generateCssMaskSnippet(icon, variant, customization);
      case 'data-uri':
        return generateDataUri(variant, customization);
      default:
        return '';
    }
  }, [activeFormat, icon, variant, customization]);

  const handleCopy = () => {
    copyToClipboard(formattedCode);
    setCopied(true);
    success(`Copied ${activeFormat.toUpperCase()} snippet`);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-text-tertiary" />
          <span>{icon.name} — Code Snippet</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Format Selector Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-border-default pb-3">
          <div className="flex items-center gap-1">
            {FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setActiveFormat(fmt.id)}
                className={cn(
                  'px-2.5 py-1 text-xs font-mono rounded-xs transition-colors border',
                  activeFormat === fmt.id
                    ? 'bg-action-primary text-text-inverse border-action-primary font-semibold'
                    : 'bg-bg-secondary text-text-secondary border-border-default hover:text-text-primary hover:border-border-strong'
                )}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          <Button variant="primary" size="sm" onClick={handleCopy} className="shrink-0">
            {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </Button>
        </div>

        {/* Code Content Frame: native scrolling, selectable, no Lenis interference */}
        <div className="relative rounded-md border border-border-default bg-bg-secondary p-4 overflow-hidden">
          <pre className="text-xs font-mono text-text-primary max-h-[50vh] overflow-auto native-scroll select-text leading-relaxed whitespace-pre font-normal">
            <code>{formattedCode}</code>
          </pre>
        </div>
      </div>
    </Modal>
  );
};
