import { useEffect } from 'react';
import { useLenis } from './useLenis';

let activeLockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

/**
 * useScrollLock hook to disable background scrolling when modals,
 * drawers, or command palettes are open.
 * Synchronizes with the Lenis smooth-scroll instance and native document body.
 */
export function useScrollLock(lock: boolean = true) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lock || typeof document === 'undefined') return;

    if (activeLockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      if (lenis) {
        lenis.stop();
      }
    }

    activeLockCount++;

    return () => {
      activeLockCount = Math.max(0, activeLockCount - 1);

      if (activeLockCount === 0) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;

        if (lenis) {
          lenis.start();
        }
      }
    };
  }, [lock, lenis]);
}

export default useScrollLock;

