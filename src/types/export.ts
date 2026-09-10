import { IconCustomization } from './customization';
import { Icon, IconVariant } from './icon';

export type ExportFormat = 'svg' | 'react' | 'html' | 'data-uri' | 'css';

export interface ExportFormatOption {
  id: ExportFormat;
  label: string;
  language: string;
  description: string;
  badge?: string;
}

export interface ExportContext {
  icon: Icon;
  variant: IconVariant;
  customization: IconCustomization;
}

export interface ExportResult {
  code: string;
  language: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}
