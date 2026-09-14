import { useEffect } from 'react';

export interface MetadataOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
}

/**
 * Hook to dynamically update document title, meta descriptions,
 * Open Graph, Twitter cards, and canonical link tags for SEO.
 */
export function useDocumentTitle(
  title?: string,
  description?: string,
  options?: MetadataOptions
) {
  useEffect(() => {
    // 1. Title
    const defaultTitle = 'GRIDFRAME — Precision Icon Workstation';
    const finalTitle = title ? (title.includes('GRIDFRAME') ? title : `${title} — GRIDFRAME`) : defaultTitle;
    document.title = finalTitle;

    // Helper to update or create meta tags
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta Description
    const defaultDescription =
      'A precision vector icon workstation for designers and developers: search, inspect, customize, and export production-ready vector icons.';
    const finalDescription = description || options?.description || defaultDescription;
    setMetaTag('meta[name="description"]', 'name', 'description', finalDescription);

    // 3. Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', finalTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDescription);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', options?.ogType || 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'GRIDFRAME');

    const ogImage = options?.ogImage || '/og-image.svg';
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);

    // 4. Twitter Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 5. Canonical Link
    const baseUrl = 'https://gridframe.dev';
    const canonicalPath = options?.canonicalPath || window.location.pathname;
    const fullCanonicalUrl = `${baseUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);
  }, [title, description, options?.canonicalPath, options?.ogType, options?.ogImage, options?.description]);
}
