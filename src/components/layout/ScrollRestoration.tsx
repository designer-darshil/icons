import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from '@/hooks/useLenis';

/**
 * ScrollRestoration component ensures that navigating to any new route
 * starts at the very top of the page (scrollTop = 0), synchronizing both
 * window scroll and the Lenis smooth scroll instance.
 */
export const ScrollRestoration: React.FC = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();
  const prevPathRef = React.useRef(pathname);

  useEffect(() => {
    // Only perform scroll restoration when navigating to a different route
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
      if (typeof document !== 'undefined') {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }
  }, [pathname, lenis]);

  return null;
};

