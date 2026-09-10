import { useEffect } from 'react';

/**
 * Hook to dynamically update the document title and meta description.
 */
export function useDocumentTitle(title?: string, description?: string) {
  useEffect(() => {
    const defaultTitle = 'Glyphroom — Vector Icon Workstation';
    const finalTitle = title ? `${title} — Glyphroom` : defaultTitle;
    document.title = finalTitle;

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
}
