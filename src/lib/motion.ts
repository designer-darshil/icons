import type { Transition, Variants } from 'framer-motion';

/**
 * Standard Timing Tokens (in seconds)
 */
export const MOTION_TIMING = {
  instant: 0.1,
  fast: 0.16,
  standard: 0.24,
  moderate: 0.32,
  slow: 0.45,
} as const;

/**
 * Easing Curves
 */
export const MOTION_EASE = {
  standard: [0.16, 1, 0.3, 1] as const, // Apple/Vercel standard deceleration
  outQuad: [0.25, 0.46, 0.45, 0.94] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  sharp: [0.4, 0, 0.6, 1] as const,
};

/**
 * Spring Configurations
 */
export const MOTION_SPRINGS = {
  snappy: { type: 'spring', damping: 24, stiffness: 320 } as const,
  gentle: { type: 'spring', damping: 28, stiffness: 260 } as const,
  bouncy: { type: 'spring', damping: 18, stiffness: 280 } as const,
  drawer: { type: 'spring', damping: 26, stiffness: 280 } as const,
};

/**
 * Fade In/Out Variants
 */
export const fadeInVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: MOTION_TIMING.standard, ease: MOTION_EASE.standard } },
  exit: { opacity: 0, y: 4, transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.standard } },
};

/**
 * Modal & Dialog Scale Transition Variants
 */
export const modalScaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: -6 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: MOTION_TIMING.standard, ease: MOTION_EASE.standard } },
  exit: { opacity: 0, scale: 0.96, y: -6, transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.standard } },
};

/**
 * Bottom Sheet / Drawer Slide Variants
 */
export const bottomSheetVariants: Variants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: MOTION_SPRINGS.drawer },
  exit: { y: '100%', transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.standard } },
};

/**
 * Toast Notification Variants
 */
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.92 },
  animate: { opacity: 1, y: 0, scale: 1, transition: MOTION_SPRINGS.snappy },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.standard } },
};

/**
 * Standard Reduced Motion Fallback Transition
 */
export const reducedMotionTransition: Transition = {
  duration: 0.01,
};
