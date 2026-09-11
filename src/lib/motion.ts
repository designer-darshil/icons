import type { Transition, Variants } from 'framer-motion';

/**
 * ==============================================================================
 * GRIDFRAME V2 MOTION SYSTEM
 * ==============================================================================
 * Architectural, restrained motion communicating hierarchy, state, and feedback.
 * Easing: Custom MadeByShape / Apple Deceleration Curves
 */

/**
 * Timing Tokens (seconds)
 */
export const MOTION_TIMING = {
  micro: 0.12,      // Micro-interactions (hover, toggles, icon checks)
  fast: 0.18,       // Dropdowns, tooltips, action reveals
  standard: 0.26,   // Modals, command palette, cards
  entrance: 0.38,   // Page entrance, hero reveal
  drawer: 0.32,     // Mobile drawer slide
} as const;

/**
 * Easing Curves
 */
export const MOTION_EASE = {
  gridframe: [0.16, 1, 0.3, 1] as const,     // Primary editorial deceleration
  smoothOut: [0.22, 1, 0.36, 1] as const,    // Smooth gentle finish
  sharp: [0.4, 0, 0.2, 1] as const,          // High-contrast state changes
  linear: [0, 0, 1, 1] as const,
};

/**
 * Spring Physics Configurations
 */
export const MOTION_SPRINGS = {
  snappy: { type: 'spring', damping: 26, stiffness: 340 } as const,
  drawer: { type: 'spring', damping: 32, stiffness: 300 } as const,
  gentle: { type: 'spring', damping: 28, stiffness: 240 } as const,
  pop: { type: 'spring', damping: 18, stiffness: 380 } as const,
};

/**
 * 1. Page Entrance Transition
 */
export const pageEntranceVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TIMING.entrance,
      ease: MOTION_EASE.gridframe,
    },
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: {
      duration: MOTION_TIMING.fast,
      ease: MOTION_EASE.sharp,
    },
  },
};

/**
 * 2. Staggered Container & Children
 */
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TIMING.standard,
      ease: MOTION_EASE.gridframe,
    },
  },
};

/**
 * 3. Modal & Command Palette Variants
 */
export const modalOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.smoothOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_TIMING.micro, ease: MOTION_EASE.sharp },
  },
};

export const modalDialogVariants: Variants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: MOTION_TIMING.standard, ease: MOTION_EASE.gridframe },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 6,
    transition: { duration: MOTION_TIMING.micro, ease: MOTION_EASE.sharp },
  },
};

export const commandPaletteVariants: Variants = {
  initial: { opacity: 0, scale: 0.99, y: -8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.gridframe },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    y: -4,
    transition: { duration: MOTION_TIMING.micro, ease: MOTION_EASE.sharp },
  },
};

/**
 * 4. Mobile Drawer Variants
 */
export const drawerVariants: Variants = {
  initial: { x: '100%' },
  animate: {
    x: 0,
    transition: MOTION_SPRINGS.drawer,
  },
  exit: {
    x: '100%',
    transition: { duration: MOTION_TIMING.fast, ease: MOTION_EASE.sharp },
  },
};

/**
 * 5. Toast Notification Variants
 */
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.94 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: MOTION_SPRINGS.snappy,
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.96,
    transition: { duration: MOTION_TIMING.micro, ease: MOTION_EASE.sharp },
  },
};

/**
 * 6. Interactive Micro-Tap Variants
 */
export const buttonTapTransition: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 25,
};

/**
 * Reduced Motion Fallback
 */
export const reducedMotionTransition: Transition = {
  duration: 0.01,
};

