import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { LenisContext } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface LenisProviderProps {
  children: React.ReactNode;
}

export const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const rafHandleRef = useRef<number | null>(null);

  useEffect(() => {
    // If user prefers reduced motion or is on narrow touch screens where native momentum is superior, avoid Lenis
    if (prefersReducedMotion || typeof window === 'undefined') {
      return;
    }

    const instance = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1,
    });

    setLenis(instance);

    function raf(time: number) {
      instance.raf(time);
      rafHandleRef.current = requestAnimationFrame(raf);
    }

    rafHandleRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafHandleRef.current) {
        cancelAnimationFrame(rafHandleRef.current);
      }
      instance.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
};
