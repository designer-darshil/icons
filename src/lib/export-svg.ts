/**
 * Utilities for downloading files and copying text safely in modern browsers
 */

import { optimizeSvg } from './svg/optimizeSvg';

/**
 * Initiates a browser file download using a Blob and object URL.
 * Automatically cleans up the object URL after triggering.
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'image/svg+xml'
): boolean {
  try {
    const finalContent = mimeType === 'image/svg+xml' ? optimizeSvg(content) : content;
    const blob = new Blob([finalContent], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);

    return true;
  } catch (err) {
    console.error('Failed to trigger download:', err);
    return false;
  }
}

/**
 * Copies text to the user's clipboard using the Clipboard API,
 * with fallback to execCommand for older environments.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  // Fallback for non-secure contexts or older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
