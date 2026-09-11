import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

import { useScrollLock } from '@/hooks/useScrollLock';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { modalOverlayVariants, modalDialogVariants } from '@/lib/motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
  showCloseButton?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = '4xl',
  showCloseButton = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Unified scroll lock coordinates Lenis & document body overflow
  useScrollLock(isOpen);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Overlay Backdrop */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-bg-overlay cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            variants={prefersReducedMotion ? undefined : modalDialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full bg-bg-primary border border-border-default rounded-lg shadow-modal flex flex-col max-h-[90vh] overflow-hidden z-10 my-auto',
              maxWidthClasses[maxWidth],
              className
            )}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle bg-bg-secondary shrink-0">
                <div>
                  {typeof title === 'string' ? (
                    <h2 className="text-sm font-semibold tracking-tight text-text-primary">
                      {title}
                    </h2>
                  ) : (
                    title
                  )}
                  {description && (
                    <p className="text-[11px] text-text-tertiary mt-0.5">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="p-2 -mr-2 -my-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer touch-manipulation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            <div
              data-lenis-prevent="true"
              className="p-5 flex-1 min-h-0 overflow-y-auto native-scroll overscroll-contain"
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
