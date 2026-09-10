import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastVariants } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', duration = 3000) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}

      {/* Floating Toast Notification Region */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              variants={prefersReducedMotion ? undefined : toastVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                'pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-xs font-medium',
                toast.type === 'success' && 'bg-surface/95 text-foreground border-emerald-500/30 dark:border-emerald-500/20 shadow-emerald-500/5',
                toast.type === 'error' && 'bg-surface/95 text-rose-500 border-rose-500/30 shadow-rose-500/5',
                toast.type === 'info' && 'bg-surface/95 text-foreground border-brand-500/30'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {toast.type === 'success' && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <Info className="w-3 h-3" />
                  </div>
                )}
                <span className="truncate leading-relaxed">{toast.message}</span>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 text-foreground-muted hover:text-foreground rounded-lg transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
